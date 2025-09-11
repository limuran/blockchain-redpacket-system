// 支持 @chainlink/env-enc 和分离私钥的 Hardhat 配置
require("@nomicfoundation/hardhat-toolbox");

// 尝试加载加密的环境变量
try {
  require("@chainlink/env-enc").config();
  console.log("🔐 Loaded encrypted environment variables");
} catch (error) {
  // 如果没有安装 @chainlink/env-enc，回退到普通的 dotenv
  try {
    require('dotenv').config();
    console.log("📝 Loaded standard environment variables");
  } catch (dotenvError) {
    console.log("⚠️  No environment file loaded");
  }
}

// 智能选择私钥的函数
function getPrivateKey(network) {
  // 优先级：网络专用私钥 > 通用私钥
  if (network === 'mainnet') {
    return process.env.MAINNET_PRIVATE_KEY || process.env.PRIVATE_KEY;
  } else {
    // 测试网优先使用测试网私钥
    return process.env.TESTNET_PRIVATE_KEY || process.env.PRIVATE_KEY;
  }
}

// 获取账户数组的函数
function getAccounts(network) {
  const privateKey = getPrivateKey(network);
  return privateKey ? [privateKey] : [];
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.30", // 匹配你现有合约的版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.19", // 备用版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ]
  },
  networks: {
    // Sepolia 测试网
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: getAccounts('sepolia'),
      gas: 5000000,
      gasPrice: 20000000000, // 20 gwei
      chainId: 11155111
    },
    
    // Goerli 测试网（即将废弃，但仍可用）
    goerli: {
      url: process.env.GOERLI_RPC_URL || `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: getAccounts('goerli'),
      gas: 5000000,
      gasPrice: 20000000000,
      chainId: 5
    },
    
    // 以太坊主网
    mainnet: {
      url: process.env.MAINNET_RPC_URL || `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: getAccounts('mainnet'),
      gasPrice: "auto", // 主网使用自动Gas价格
      chainId: 1
    },
    
    // 本地开发网络
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: getAccounts('localhost')
    },
    
    // Hardhat 内置网络
    hardhat: {
      chainId: 31337,
      // 如果需要导入账户到Hardhat网络
      accounts: process.env.PRIVATE_KEY ? [
        {
          privateKey: process.env.PRIVATE_KEY,
          balance: "10000000000000000000000" // 10000 ETH
        }
      ] : []
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
