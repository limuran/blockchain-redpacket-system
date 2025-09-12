export const REDPACKET_ABI = [
  {
    "inputs": [],
    "name": "RedPacketCreated",
    "type": "event",
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "redPacketId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "totalAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "totalCount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "message",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "timestamp",
        "type": "uint256"
      }
    ]
  },
  {
    "inputs": [],
    "name": "RedPacketClaimed",
    "type": "event",
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "redPacketId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "claimer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "timestamp",
        "type": "uint256"
      }
    ]
  },
  {
    "inputs": [
      {
        "name": "_totalCount",
        "type": "uint256"
      },
      {
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "createRedPacket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_redPacketId",
        "type": "uint256"
      }
    ],
    "name": "claimRedPacket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_redPacketId",
        "type": "uint256"
      }
    ],
    "name": "getRedPacketInfo",
    "outputs": [
      {
        "components": [
          {
            "name": "creator",
            "type": "address"
          },
          {
            "name": "totalAmount",
            "type": "uint256"
          },
          {
            "name": "totalCount",
            "type": "uint256"
          },
          {
            "name": "claimedCount",
            "type": "uint256"
          },
          {
            "name": "message",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ],
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
        "name": "_redPacketId",
        "type": "uint256"
      },
      {
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "hasClaimed",
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
    "inputs": [],
    "name": "redPacketCounter",
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
    "inputs": [
      {
        "name": "_redPacketId",
        "type": "uint256"
      }
    ],
    "name": "getClaimers",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;