// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * SimpleFundManager
 * - Create funds with target asset allocations (in BPS).
 * - Accept USDC investments into a fund; records principal and TVL.
 * - No swapping, no fees, no withdrawals (left for your strategy/core).
 */
contract SimpleFundManager is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint16 public constant BPS_DENOM = 10_000;

    IERC20 public immutable USDC; // 6 decimals on most chains

    constructor(address usdc, address owner_) Ownable(owner_) {
        require(usdc != address(0) && owner_ != address(0), "init");
        USDC = IERC20(usdc);
    }

    /* ---------------------------- Data Models ---------------------------- */

    struct Asset {
        address token;      // ERC20 token address
        uint16 shareBps;    // share in basis points (sum of all assets = 10_000)
    }

    struct Fund {
        string uuid;        // your external identifier (unique key)
        address creator;    // fund owner/creator
        uint256 tvlUSDC;    // total contributed principal (USDC units)
        bool exists;        
        Asset[] assets;     // target allocation
    }

    struct Investment {
        uint256 id;
        address investor;
        string fundId;
        uint256 principalUSDC;
       uint256 creditedProfitUSDC;    // profit assigned by manager
        uint256 claimedProfitUSDC;     // profit already claimed
        uint256 timestamp;
        bool active;
    }

    // fundId (uuid string) => Fund
    mapping(string => Fund) private funds;

    // per-user index
    mapping(address => uint256[]) public investmentsByUser;

    // global investments
    uint256 public nextInvestmentId = 1;
    mapping(uint256 => Investment) public investments;

    /* ------------------------------ Events ------------------------------ */

    event FundCreated(string indexed fundId, address indexed creator);
    event FundAsset(string indexed fundId, address indexed token, uint16 shareBps);
    event Invested(uint256 indexed invId, string indexed fundId, address indexed investor, uint256 usdcAmount);
 event ProfitCredited(uint256 indexed invId, uint256 amount);
    event ProfitClaimed(uint256 indexed invId, uint256 amount);
    /* ---------------------------- Create Fund --------------------------- */

    /**
     * Create a new fund with target allocations.
     * - sharesBps must sum to 10,000 (100%).
     */
    function createFund(
        string calldata fundId,
        address[] calldata tokens,
        uint16[] calldata sharesBps
    ) external {
        require(!funds[fundId].exists, "fund exists");

        uint256 n = tokens.length;
        require(n > 0 && n == sharesBps.length, "length");

        uint256 sum;
        for (uint256 i; i < n; ) {
            require(tokens[i] != address(0), "token=0");
            sum += sharesBps[i];
            unchecked { ++i; }
        }
        require(sum == BPS_DENOM, "shares!=100%");

        Fund storage f = funds[fundId];
        f.uuid = fundId;
        f.creator = msg.sender;
        f.exists = true;

        for (uint256 i; i < n; ) {
            f.assets.push(Asset({ token: tokens[i], shareBps: sharesBps[i] }));
            emit FundAsset(fundId, tokens[i], sharesBps[i]);
            unchecked { ++i; }
        }

        emit FundCreated(fundId, msg.sender);
    }

    /* ----------------------------- Investment --------------------------- */

    /**
     * Invest USDC into a fund (requires prior USDC approve).
     * @param fundId   The target fund uuid.
     * @param usdcAmount  Amount of USDC to transfer (use smallest units; e.g., 1 USDC = 1_000_000 if 6 decimals)
     */
    function invest(string calldata fundId, uint256 usdcAmount)
        external
        nonReentrant
        returns (uint256 invId)
    {
        Fund storage f = _requireFund(fundId);
        require(usdcAmount > 0, "amount=0");

        // Pull USDC from user
        USDC.transferFrom(msg.sender, address(this), usdcAmount);

        // Record investment
        invId = nextInvestmentId++;
        investments[invId] = Investment({
            id: invId,
            investor: msg.sender,
            fundId: fundId,
            principalUSDC: usdcAmount,
            timestamp: block.timestamp,
            creditedProfitUSDC: 0,
            claimedProfitUSDC: 0,
            active: true
        });
        investmentsByUser[msg.sender].push(invId);

        // Update TVL
        f.tvlUSDC += usdcAmount;

        emit Invested(invId, fundId, msg.sender, usdcAmount);
    }

   /// @notice Fund creator credits profit to a specific investment
    function creditProfit(uint256 invId, uint256 profitUSDC) external nonReentrant {
        Investment storage iv = investments[invId];
        require(iv.active, "inactive");
        // string calldata fndId = iv.fundId;
        Fund storage f = _requireFund(iv.fundId);
        require(msg.sender == f.creator || msg.sender == owner(), "not fund creator");
        require(profitUSDC > 0, "zero");

        iv.creditedProfitUSDC += profitUSDC;

        emit ProfitCredited(invId, profitUSDC);
    }

    /// @notice Investor claims unclaimed profit
    function claimProfit(uint256 invId) external nonReentrant {
        Investment storage iv = investments[invId];
        require(iv.investor == msg.sender, "not investor");
        require(iv.active, "inactive");

        uint256 unclaimed = iv.creditedProfitUSDC - iv.claimedProfitUSDC;
        require(unclaimed > 0, "no profit");

        iv.claimedProfitUSDC += unclaimed;
        USDC.safeTransfer(msg.sender, unclaimed);

        emit ProfitClaimed(invId, unclaimed);
    }

    /* ---------------------------- Helper Reads ---------------------------- */

    function getUnclaimedProfit(uint256 invId) external view returns (uint256) {
        Investment memory iv = investments[invId];
        return iv.creditedProfitUSDC - iv.claimedProfitUSDC;
    }
 
    /* ------------------------------- Reads ------------------------------ */

    function getFund(string calldata fundId)
        external
        view
        returns (string memory uuid, address creator, uint256 tvlUSDC, address[] memory tokens, uint16[] memory shares)
    {
        Fund storage f = _requireFund(fundId);
        uuid = f.uuid;
        creator = f.creator;
        tvlUSDC = f.tvlUSDC;

        uint256 n = f.assets.length;
        tokens = new address[](n);
        shares = new uint16[](n);
        for (uint256 i; i < n; ) {
            tokens[i] = f.assets[i].token;
            shares[i] = f.assets[i].shareBps;
            unchecked { ++i; }
        }
    }

    function getFundAssetCount(string calldata fundId) external view returns (uint256) {
        return _requireFund(fundId).assets.length;
    }

    function getInvestmentsByUser(address user) external view returns (uint256[] memory) {
        return investmentsByUser[user];
    }

    /* --------------------------- Internal Utils ------------------------- */

    function _requireFund(string memory fundId) internal view returns (Fund storage f) {
        f = funds[fundId];
        require(f.exists, "fund not found");
    }
}
