# 🎁 链上红包系统前端

基于区块链的去中心化红包分发系统前端界面。

## ✨ 功能特性

- 🎯 **发送红包**: 创建ETH红包，设置数量和祝福消息
- 🎉 **领取红包**: 通过红包ID领取ETH奖励
- 📊 **数据统计**: 完整的红包数据和用户活动记录
- 🔄 **实时更新**: 基于事件监听的实时状态更新
- 💳 **钱包集成**: 支持MetaMask、WalletConnect等多种钱包
- 📱 **响应式**: 完美适配移动端和桌面端

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 配置环境变量
```bash
# .env.local
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_SUBGRAPH_URL=your_subgraph_url
```

### 启动项目
```bash
npm run dev
```

## 🔧 技术栈

- **Next.js 14** + TypeScript
- **Wagmi** + RainbowKit (钱包连接)
- **Tailwind CSS** (样式)
- **Apollo GraphQL** (数据查询)
- **React Hot Toast** (通知)

## 📊 核心功能

### 钱包连接
- 多钱包支持 (MetaMask、WalletConnect)
- ENS域名显示
- 网络切换

### 发送红包
- ETH金额设置
- 红包数量配置
- 祝福消息
- 交易状态跟踪

### 领取红包
- 红包ID输入
- 状态检查(防重复领取)
- 进度显示
- 成功动画

### 数据统计
- 所有红包列表
- 我的红包
- 领取记录
- 最近活动

## 🏗️ 项目结构

```
src/
├── app/              # Next.js页面
├── components/       # React组件
│   ├── ui/          # 基础UI组件
│   └── *.tsx        # 功能组件
├── config/          # 配置文件
└── lib/             # 工具库
```

## 🔐 合约信息

- **地址**: `0x2bB8eaBb0B662E4fA333A9bF119017994194107E`
- **网络**: Ethereum (主网/测试网)

## 📱 部署

### Vercel (推荐)
1. 连接GitHub仓库
2. 配置环境变量
3. 自动部署

### 本地构建
```bash
npm run build
npm start
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

🎊 **享受Web3红包的乐趣！** 🎊