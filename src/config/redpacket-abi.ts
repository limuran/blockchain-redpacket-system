export const REDPACKET_ABI = [
  {
    "inputs": [
      {
        "name": "_count",
        "type": "uint256"
      },
      {
        "name": "_isEqual", 
        "type": "bool"
      },
      {
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "createRedPackage",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_redPackageId",
        "type": "uint256"
      }
    ],
    "name": "grabRedPackage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_redPackageId",
        "type": "uint256"
      }
    ],
    "name": "getRedPackageInfo",
    "outputs": [
      {
        "name": "creator",
        "type": "address"
      },
      {
        "name": "totalAmount",
        "type": "uint256"
      },
      {
        "name": "remainingAmount",
        "type": "uint256"
      },
      {
        "name": "totalCount",
        "type": "uint256"
      },
      {
        "name": "remainingCount",
        "type": "uint256"
      },
      {
        "name": "isEqual",
        "type": "bool"
      },
      {
        "name": "createTime",
        "type": "uint256"
      },
      {
        "name": "isActive",
        "type": "bool"
      },
      {
        "name": "message",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_redPackageId",
        "type": "uint256"
      },
      {
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "hasUserGrabbed",
    "outputs": [
      {
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
        "name": "_redPackageId",
        "type": "uint256"
      }
    ],
    "name": "getGrabRecords",
    "outputs": [
      {
        "components": [
          {
            "name": "grabber",
            "type": "address"
          },
          {
            "name": "amount",
            "type": "uint256"
          },
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextRedPackageId",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "redPackageId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "totalAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "count",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "isEqual",
        "type": "bool"
      },
      {
        "indexed": false,
        "name": "message",
        "type": "string"
      }
    ],
    "name": "RedPackageCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "redPackageId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "grabber",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "remainingCount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "remainingAmount",
        "type": "uint256"
      }
    ],
    "name": "RedPackageGrabbed",
    "type": "event"
  }
] as const;