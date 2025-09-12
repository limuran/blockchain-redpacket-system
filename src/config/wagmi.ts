import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Blockchain RedPacket',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default-project-id',
  chains: [
    sepolia,
    mainnet, 
    polygon,
    optimism,
    arbitrum,
    base,
  ],
  ssr: true,
  // 优化配置
  multiInjectedProviderDiscovery: false,
});

// 红包合约地址
export const REDPACKET_CONTRACT_ADDRESS = '0x2bB8eaBb0B662E4fA333A9bF119017994194107E' as `0x${string}`;

// The Graph 子图端点
export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || 'https://api.studio.thegraph.com/query/[your-subgraph-id]/redpacket-subgraph/version/latest';

// 优化的RPC配置
export const RPC_CONFIG = {
  pollingInterval: 12000, // 12秒轮询一次 (默认4秒)
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