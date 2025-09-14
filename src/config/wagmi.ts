import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { http } from 'viem';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) throw new Error('请设置 NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID 环境变量');

// 使用最新的配置方式
export const config = getDefaultConfig({
  appName: 'Blockchain RedPacket',
  projectId: projectId, 
  chains: [
    sepolia,
    mainnet, 
    polygon,
    optimism,
    arbitrum,
    base,
  ],
  ssr: true,
  // 为每个链配置专门的 transport
  transports: {
    [sepolia.id]: http('https://sepolia.drpc.org'),
    [mainnet.id]: http('https://ethereum.drpc.org'),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});

// 红包合约地址
export const REDPACKET_CONTRACT_ADDRESS = '0x2bB8eaBb0B662E4fA333A9bF119017994194107E' as `0x${string}`;

// The Graph 子图端点
export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

// 优化的RPC配置
export const RPC_CONFIG = {
  pollingInterval: 12_000, // 12秒轮询一次 (默认4秒)
  retryCount: 3,
  retryDelay: 1000,
};

// 支持的链配置
export const SUPPORTED_CHAINS = {
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.drpc.org',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
  mainnet: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://ethereum.drpc.org',
    explorerUrl: 'https://etherscan.io',
  }
};