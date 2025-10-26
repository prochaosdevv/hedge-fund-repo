export const HedgeManagerAbi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "invId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "beginExit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes16",
				"name": "uuid",
				"type": "bytes16"
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "invId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "usdcGrossOut",
				"type": "uint256"
			}
		],
		"name": "finalizeExit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_usdc",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
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
				"internalType": "address",
				"name": "core",
				"type": "address"
			}
		],
		"name": "CoreSet",
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
				"indexed": false,
				"internalType": "uint256",
				"name": "usdcGrossOut",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "commission",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "netPaid",
				"type": "uint256"
			}
		],
		"name": "ExitFinalized",
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
				"name": "to",
				"type": "address"
			}
		],
		"name": "ExitStarted",
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
		"name": "FundAsset",
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
				"internalType": "bytes16",
				"name": "uuid",
				"type": "bytes16"
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
				"name": "usdcIn",
				"type": "uint256"
			}
		],
		"name": "InvestRecorded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "priceId",
				"type": "bytes32"
			}
		],
		"name": "PriceIdSet",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "PriceIdUnset",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "priceId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "int64",
				"name": "price",
				"type": "int64"
			},
			{
				"indexed": false,
				"internalType": "int32",
				"name": "expo",
				"type": "int32"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "conf",
				"type": "uint64"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "publishTime",
				"type": "uint64"
			}
		],
		"name": "PricePushed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "priceId",
				"type": "bytes32"
			},
			{
				"internalType": "int64",
				"name": "price",
				"type": "int64"
			},
			{
				"internalType": "int32",
				"name": "expo",
				"type": "int32"
			},
			{
				"internalType": "uint64",
				"name": "conf",
				"type": "uint64"
			},
			{
				"internalType": "uint64",
				"name": "publishTime",
				"type": "uint64"
			}
		],
		"name": "pushPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "priceIds",
				"type": "bytes32[]"
			},
			{
				"internalType": "int64[]",
				"name": "prices",
				"type": "int64[]"
			},
			{
				"internalType": "int32[]",
				"name": "expos",
				"type": "int32[]"
			},
			{
				"internalType": "uint64[]",
				"name": "confs",
				"type": "uint64[]"
			},
			{
				"internalType": "uint64[]",
				"name": "publishTimes",
				"type": "uint64[]"
			}
		],
		"name": "pushPrices",
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
				"internalType": "address",
				"name": "investor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "principalUSDC",
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
				"internalType": "address[]",
				"name": "tokens",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amounts",
				"type": "uint256[]"
			}
		],
		"name": "recordInvestment",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "invId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_core",
				"type": "address"
			}
		],
		"name": "setCore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "priceId",
				"type": "bytes32"
			}
		],
		"name": "setPriceId",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "tokens",
				"type": "address[]"
			},
			{
				"internalType": "bytes32[]",
				"name": "priceIds",
				"type": "bytes32[]"
			}
		],
		"name": "setPriceIds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "unsetPriceId",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
		"inputs": [],
		"name": "core",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
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
				"internalType": "uint256",
				"name": "invId",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "priceId",
				"type": "bytes32"
			}
		],
		"name": "getEntrySnapshot",
		"outputs": [
			{
				"components": [
					{
						"internalType": "int64",
						"name": "price",
						"type": "int64"
					},
					{
						"internalType": "int32",
						"name": "expo",
						"type": "int32"
					},
					{
						"internalType": "uint64",
						"name": "conf",
						"type": "uint64"
					},
					{
						"internalType": "uint64",
						"name": "publishTime",
						"type": "uint64"
					}
				],
				"internalType": "struct HedgeFundManager.PriceSnapshot",
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
				"internalType": "uint256",
				"name": "invId",
				"type": "uint256"
			}
		],
		"name": "getEntrySnapshotIds",
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
				"internalType": "bytes16",
				"name": "uuid",
				"type": "bytes16"
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
				"name": "tvlUSDC",
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
				"name": "creator",
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
				"name": "invId",
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
						"name": "principalUSDC",
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
						"internalType": "bool",
						"name": "exiting",
						"type": "bool"
					}
				],
				"internalType": "struct HedgeFundManager.Investment",
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
				"internalType": "uint256",
				"name": "invId",
				"type": "uint256"
			}
		],
		"name": "getInvestmentTokens",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
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
				"name": "principalUSDC",
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
				"internalType": "bool",
				"name": "exiting",
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
			},
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "invPriceAtEntry",
		"outputs": [
			{
				"internalType": "int64",
				"name": "price",
				"type": "int64"
			},
			{
				"internalType": "int32",
				"name": "expo",
				"type": "int32"
			},
			{
				"internalType": "uint64",
				"name": "conf",
				"type": "uint64"
			},
			{
				"internalType": "uint64",
				"name": "publishTime",
				"type": "uint64"
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "invPriceIds",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "invTokenBal",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "invTokens",
		"outputs": [
			{
				"internalType": "address",
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
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "latestPrice",
		"outputs": [
			{
				"internalType": "int64",
				"name": "price",
				"type": "int64"
			},
			{
				"internalType": "int32",
				"name": "expo",
				"type": "int32"
			},
			{
				"internalType": "uint64",
				"name": "conf",
				"type": "uint64"
			},
			{
				"internalType": "uint64",
				"name": "publishTime",
				"type": "uint64"
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
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "priceIdForToken",
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
		"name": "USDC",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]