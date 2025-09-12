# 🎁 完整区块链红包系统

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-red.svg)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)
[![The Graph](https://img.shields.io/badge/The%20Graph-Protocol-purple.svg)](https://thegraph.com/)

> 🚀 **一站式区块链红包解决方案** - 从智能合约到子图索引，再到完整的Web3前端界面

基于以太坊的去中心化红包系统，支持发送和领取ETH红包，具备完整的数据统计和实时事件监听功能。

## ✨ 系统特色

### 🎯 核心功能
- **💰 发送红包**: 创建ETH红包，支持随机金额分配
- **🎉 领取红包**: 通过ID领取红包，防重复领取
- **📊 数据统计**: 完整的红包数据和用户活动记录  
- **🔔 实时通知**: 基于事件监听的实时状态更新

### 💡 技术亮点
- **🔗 全栈Web3**: 合约 + 子图 + 前端完整解决方案
- **🌐 多钱包支持**: MetaMask、WalletConnect等
- **🏷️ ENS集成**: 显示ENS域名而非地址
- **📱 响应式设计**: 完美适配移动端和桌面端
- **⚡ 实时同步**: 链上事件实时同步到前端

## 🏗️ 系统架构

```
区块链红包系统
├── 智能合约层 (Solidity)
│   ├── RedPackage.sol          # 核心红包合约
│   ├── 部署脚本               # Hardhat部署配置
│   └── 测试套件               # 合约单元测试
├── 数据索引层 (The Graph)
│   ├── Schema定义             # GraphQL数据模型
│   ├── 事件映射               # 链上事件到数据的映射
│   └── 查询API               # GraphQL查询接口
└── 前端应用层 (Next.js)
    ├── Web3集成              # 钱包连接和合约交互
    ├── 用户界面              # 现代化的红包UI
    ├── 数据展示              # 实时数据统计和图表
    └── 事件监听              # 实时状态更新
```

## 🚀 快速开始

### 环境要求
- **Node.js** 18+ 
- **npm** 8+ 或 **yarn**
- **MetaMask** 或其他Web3钱包
- **The Graph CLI** (用于子图部署)

### 1️⃣ 克隆项目
```bash
git clone https://github.com/limuran/blockchain-redpacket-system.git
cd blockchain-redpacket-system
```

### 2️⃣ 安装依赖
```bash
npm install
# 或者
yarn install
```

### 3️⃣ 配置环境变量
```bash
cp .env.example .env.local
```

编辑 `.env.local`：
```env
# 必需配置
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_SUBGRAPH_URL=your_subgraph_url

# 可选配置  
NEXT_PUBLIC_INFURA_KEY=your_infura_key
```

### 4️⃣ 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 🎉

## 📁 项目结构详解

```
blockchain-redpacket-system/
├── 📂 contracts/                    # 智能合约
│   ├── RedPackage.sol              # 🎁 核心红包合约
│   ├── DataStorage.sol             # 📊 数据存储合约  
│   └── ...其他合约
├── 📂 subgraph/                     # The Graph 子图
│   ├── schema.graphql              # 📋 数据模型定义
│   ├── subgraph.yaml              # ⚙️  子图配置
│   ├── src/mapping.ts              # 🔄 事件映射逻辑
│   └── generated/                  # 🤖 自动生成代码
├── 📂 src/                         # 前端应用源码
│   ├── 📂 app/                     # Next.js App Router
│   │   ├── globals.css             # 🎨 全局样式
│   │   ├── layout.tsx              # 📐 根布局
│   │   └── page.tsx                # 🏠 主页面
│   ├── 📂 components/              # React组件库
│   │   ├── 📂 ui/                  # 🧩 基础UI组件
│   │   ├── CreateRedPacket.tsx     # ➕ 创建红包
│   │   ├── ClaimRedPacket.tsx      # 🎯 领取红包  
│   │   ├── DataTable.tsx           # 📊 数据表格
│   │   ├── EventListener.tsx       # 👂 事件监听
│   │   ├── WalletInfo.tsx          # 💳 钱包信息
│   │   └── Providers.tsx           # 🔌 全局Provider
│   ├── 📂 config/                  # 配置文件
│   │   ├── wagmi.ts                # 🌐 钱包配置
│   │   └── redpacket-abi.ts        # 📜 合约ABI
│   └── 📂 lib/                     # 工具库
│       ├── graphql.ts              # 🔍 GraphQL查询
│       └── utils.ts                # 🛠️  通用工具
├── 📂 scripts/                     # 部署和工具脚本
├── 📂 test/                        # 测试文件
├── 📄 hardhat.config.js            # Hardhat配置
├── 📄 next.config.js               # Next.js配置
├── 📄 tailwind.config.js           # Tailwind CSS配置
└── 📄 package.json                 # 项目依赖和脚本
```

## 🔧 详细功能说明

### 🎁 智能合约功能 (RedPackage.sol)
```solidity
// 核心功能
- createRedPacket(count, message) payable  // 创建红包
- claimRedPacket(id)                       // 领取红包
- getRedPacketInfo(id)                     // 查询红包信息
- hasClaimed(id, user)                     // 检查是否已领取

// 安全特性  
- 防重复领取机制
- 随机金额分配算法
- 合约余额安全检查
- 事件完整记录
```

**已部署合约信息:**
- **网络**: Sepolia 测试网
- **地址**: `0x2bB8eaBb0B662E4fA333A9bF119017994194107E`
- **部署者**: `0x0F07CdFa12e37cB52f88CDdBE06Db475cf89f423`
- **区块浏览器**: [查看合约](https://sepolia.etherscan.io/address/0x2bB8eaBb0B662E4fA333A9bF119017994194107E)

### 📊 子图数据索引
```graphql
# 核心数据实体
type RedPacket @entity {
  id: ID!
  creator: Bytes!
  totalAmount: BigInt!
  totalCount: Int!
  claimedCount: Int! 
  message: String!
  createdAt: BigInt!
  isActive: Boolean!
  claims: [Claim!]!
}

type Claim @entity {
  id: ID!
  redPacket: RedPacket!
  claimer: Bytes!
  amount: BigInt!
  timestamp: BigInt!
}
```

### 🌐 前端应用功能

#### 1. 💳 钱包连接模块
- **多钱包支持**: MetaMask、WalletConnect、Coinbase Wallet等
- **ENS域名显示**: 自动解析和显示ENS域名
- **网络检测**: 自动检测和提示网络切换
- **连接状态**: 实时显示连接状态和账户信息

#### 2. 🎁 红包操作模块  
- **创建红包**:
  - ETH金额设置 (支持小数)
  - 红包数量配置 (1-100个)
  - 祝福消息输入 (最多100字)
  - 实时费用预估和确认
- **领取红包**:
  - 红包ID输入验证
  - 红包状态实时查询
  - 防重复领取检查
  - 领取成功动画效果

#### 3. 📊 数据统计模块
- **全局统计**: 所有红包数据总览
- **个人数据**: 
  - 创建的红包列表
  - 领取记录统计
  - 收支明细展示
- **实时活动**: 最新的红包创建和领取活动
- **数据筛选**: 按时间、状态、金额等筛选

#### 4. 🔔 事件通知系统
- **实时事件监听**: 
  - 红包创建通知
  - 红包领取提醒  
  - 红包状态变更
- **友好提示**: 
  - Toast消息通知
  - 状态指示器
  - 进度条显示
- **错误处理**:
  - 交易失败提示
  - 网络错误处理
  - 用户操作指导

## 🎨 UI/UX 设计特色

### 视觉设计
- **🌈 现代渐变**: 使用红色到粉色的渐变，符合红包主题
- **✨ 动画效果**: 丰富的交互动画，包括金币雨、进度条等
- **🪟 毛玻璃效果**: 现代化的毛玻璃背景和卡片设计
- **📱 响应式布局**: 完美适配各种屏幕尺寸

### 交互体验
- **🎯 直观操作**: 简单三步完成红包创建和领取
- **💡 智能提示**: 根据状态显示相应的操作建议
- **⚡ 即时反馈**: 所有操作都有实时的视觉反馈
- **🔄 状态同步**: 链上状态与界面状态实时同步

## 🚀 部署指南

### 📋 部署前准备

1. **获取必要的API密钥**:
   - [WalletConnect Cloud](https://cloud.walletconnect.com/) - Project ID
   - [Infura](https://infura.io/) - Ethereum节点服务
   - [The Graph Studio](https://thegraph.com/studio/) - 子图托管

2. **准备测试ETH**:
   - 从 [Sepolia Faucet](https://sepoliafaucet.com/) 获取测试ETH
   - 用于合约部署和测试

### 🔨 合约部署

```bash
# 编译合约
npm run contracts:compile

# 部署到Sepolia测试网
npm run contracts:deploy

# 验证合约 (可选)
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### 📈 子图部署

```bash
# 进入子图目录
cd subgraph

# 生成代码
npm run codegen

# 构建子图
npm run build

# 部署到The Graph Studio
npm run deploy
```

### 🌐 前端部署

#### Vercel (推荐)
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

#### 其他平台
- **Netlify**: 支持自动部署
- **AWS Amplify**: 支持全栈部署  
- **Railway**: 支持容器化部署

## 🔐 安全考虑

### 合约安全
- **重入攻击防护**: 使用OpenZeppelin的ReentrancyGuard
- **整数溢出防护**: Solidity 0.8+内置溢出检查
- **访问控制**: 合理的权限管理和状态检查
- **随机数安全**: 使用安全的随机数生成方式

### 前端安全  
- **输入验证**: 严格的前端输入验证和类型检查
- **交易确认**: 用户操作前的明确确认机制
- **错误处理**: 完善的异常捕获和用户提示
- **敏感信息**: 不在前端存储私钥等敏感信息

## 📊 系统数据

### 当前部署状态
- **✅ 智能合约**: 已部署到Sepolia测试网
- **✅ 子图索引**: 完整配置，支持实时查询
- **✅ 前端应用**: 功能完整，用户友好
- **✅ 测试覆盖**: 合约和前端全面测试

### 功能完整性检查
- ✅ 钱包连接和ENS解析
- ✅ 红包创建和金额设置  
- ✅ 红包领取和状态检查
- ✅ 实时事件监听和通知
- ✅ 数据统计和表格展示
- ✅ 响应式设计和移动端适配
- ✅ 错误处理和用户提示

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献
1. **🍴 Fork** 项目
2. **🌿 创建** 功能分支 (`git checkout -b feature/AmazingFeature`)
3. **💻 提交** 更改 (`git commit -m 'Add some AmazingFeature'`)
4. **📤 推送** 到分支 (`git push origin feature/AmazingFeature`)  
5. **📋 创建** Pull Request

### 开发规范
- 使用 **TypeScript** 进行类型检查
- 遵循 **ESLint** 代码规范
- 组件命名使用 **PascalCase**
- 提交信息使用 **约定式提交**

### Bug报告
使用 [GitHub Issues](https://github.com/limuran/blockchain-redpacket-system/issues) 报告bug，请包含：
- 详细的错误描述
- 复现步骤
- 预期行为
- 屏幕截图 (如适用)

## 📄 开源协议

本项目采用 [MIT 开源协议](LICENSE)

## 🙏 致谢

感谢以下开源项目和服务：

### 核心依赖
- **[Next.js](https://nextjs.org/)** - React全栈开发框架
- **[Hardhat](https://hardhat.org/)** - 以太坊开发环境  
- **[The Graph](https://thegraph.com/)** - 去中心化数据索引协议
- **[Wagmi](https://wagmi.sh/)** - React Hooks for Ethereum
- **[RainbowKit](https://www.rainbowkit.com/)** - 优雅的钱包连接组件
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的CSS框架

### 基础设施
- **[OpenZeppelin](https://openzeppelin.com/)** - 智能合约安全库
- **[Ethers.js](https://ethers.org/)** - 以太坊JavaScript库
- **[Apollo GraphQL](https://www.apollographql.com/)** - GraphQL客户端
- **[Lucide Icons](https://lucide.dev/)** - 美观的开源图标

---

<div align="center">

### 🎊 **让我们一起用区块链技术传递快乐！** 🎊

**如果这个项目对你有帮助，请给个⭐Star支持一下！**

[![Stars](https://img.shields.io/github/stars/limuran/blockchain-redpacket-system?style=social)](https://github.com/limuran/blockchain-redpacket-system/stargazers)
[![Forks](https://img.shields.io/github/forks/limuran/blockchain-redpacket-system?style=social)](https://github.com/limuran/blockchain-redpacket-system/network/members)

</div>