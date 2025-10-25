export const HedgeAbi = 
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "stablecoin",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "admin",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "settler",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AccessControlBadConfirmation",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "neededRole",
				"type": "bytes32"
			}
		],
		"name": "AccessControlUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "SafeERC20FailedOperation",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "investmentId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "bridge",
				"type": "string"
			}
		],
		"name": "BridgingOut",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			},
			{
				"internalType": "uint16",
				"name": "commissionBps",
				"type": "uint16"
			},
			{
				"internalType": "address[]",
				"name": "tokens",
				"type": "address[]"
			},
			{
				"internalType": "uint16[]",
				"name": "sharesBps",
				"type": "uint16[]"
			}
		],
		"name": "createFund",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "investmentId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint16",
				"name": "shareBps",
				"type": "uint16"
			}
		],
		"name": "DexAllocation",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "investmentId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "investor",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			}
		],
		"name": "ExitRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint16",
				"name": "shareBps",
				"type": "uint16"
			}
		],
		"name": "FundAssets",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint16",
				"name": "commissionBps",
				"type": "uint16"
			}
		],
		"name": "FundCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint16",
				"name": "slBelowBps",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "tpAboveBps",
				"type": "uint16"
			}
		],
		"name": "invest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "investmentId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "investmentId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "investor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint16",
				"name": "slBelowBps",
				"type": "uint16"
			},
			{
				"indexed": false,
				"internalType": "uint16",
				"name": "tpAboveBps",
				"type": "uint16"
			}
		],
		"name": "InvestInitiated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "callerConfirmation",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "investmentId",
				"type": "uint256"
			}
		],
		"name": "requestExit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "investmentId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "returnedAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "commissionPaid",
				"type": "uint256"
			}
		],
		"name": "Settled",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "investmentId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "returnedAmount",
				"type": "uint256"
			}
		],
		"name": "settleInvestment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "BPS_DENOM",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "claimable",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllFunds",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			}
		],
		"name": "getFund",
		"outputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint16",
				"name": "commissionBps",
				"type": "uint16"
			},
			{
				"internalType": "uint256",
				"name": "tvl",
				"type": "uint256"
			},
			{
				"internalType": "address[]",
				"name": "tokens",
				"type": "address[]"
			},
			{
				"internalType": "uint16[]",
				"name": "shares",
				"type": "uint16[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getFundsByCreator",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "investmentId",
				"type": "uint256"
			}
		],
		"name": "getInvestment",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "investor",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "fundId",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "principal",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "entryTs",
						"type": "uint256"
					},
					{
						"internalType": "uint16",
						"name": "slBelowBps",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "tpAboveBps",
						"type": "uint16"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "settledAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "settlementTs",
						"type": "uint256"
					}
				],
				"internalType": "struct HedgeFundRouter.Investment",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getInvestmentsByUser",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "investments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "investor",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "fundId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "principal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "entryTs",
				"type": "uint256"
			},
			{
				"internalType": "uint16",
				"name": "slBelowBps",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "tpAboveBps",
				"type": "uint16"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "settledAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "settlementTs",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextInvestmentId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SETTLER_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stable",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]