import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) throw new Error('请设置 NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID 环境变量');
export const config = getDefaultConfig({
  appName: 'Blockchain RedPacket',
  projectId: projectId, // 替换为你的 WalletConnect Project ID
  chains: [
    mainnet,
    sepolia,
    polygon,
    optimism,
    arbitrum,
    base,
  ],
  ssr: true,
});

// 红包合约地址
export const REDPACKET_CONTRACT_ADDRESS = '0x2bB8eaBb0B662E4fA333A9bF119017994194107E';

// The Graph 子图端点
export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
// 支持的链配置
export const SUPPORTED_CHAINS = {
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
  mainnet: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    explorerUrl: 'https://etherscan.io',
  }
};

