# 🧧 链上红包系统部署指南

## 概述

本项目实现了一个完整的去中心化红包系统，包括智能合约、前端界面、记录追踪和子图索引。

## 🏗️ 项目结构

```
blockchain-data-system/
├── contracts/
│   └── RedPackage.sol           # 红包智能合约
├── src/
│   ├── components/
│   │   ├── wallet/
│   │   │   └── WalletHeader.js  # 钱包连接组件（含ENS）
│   │   └── redpacket/
│   │       ├── RedPacketPage.js    # 主页面
│   │       ├── CreateRedPacket.js  # 发红包组件
│   │       ├── GrabRedPacket.js    # 抢红包组件
│   │       └── RedPacketRecords.js # 红包记录组件 ⭐NEW
│   ├── contexts/
│   │   └── WalletContext.js     # 钱包状态管理
│   └── hooks/
│       └── useRedPacket.js      # 合约交互Hook
└── subgraph/
    ├── redpacket-schema.graphql # 子图Schema
    └── redpacket-subgraph.yaml  # 子图配置
```

## 🚀 部署步骤

### 1. 部署智能合约

```bash
# 编译合约
npx hardhat compile

# 部署到测试网（Sepolia）
npx hardhat run scripts/deploy.js --network sepolia

# 部署到主网
npx hardhat run scripts/deploy.js --network mainnet
```

### 2. 配置前端

1. 安装依赖：
```bash
npm install ethers
```

2. 更新 `src/App.js` 引入红包系统：
```javascript
import RedPacketPage from './components/redpacket/RedPacketPage';

function App() {
  return (
    <div className="App">
      <RedPacketPage />
    </div>
  );
}
```

### 3. 部署子图（可选但推荐）

1. 安装 Graph CLI：
```bash
npm install -g @graphprotocol/graph-cli
```

2. 创建子图：
```bash
graph init --studio redpacket-subgraph
```

3. 配置子图：
   - 更新 `redpacket-subgraph.yaml` 中的合约地址
   - 更新网络配置
   - 添加合约ABI到 `abis/` 目录

4. 生成代码并部署：
```bash
graph codegen
graph build
graph deploy --studio redpacket-subgraph
```

## 🎯 功能特性

### 智能合约功能
- ✅ 创建红包（均等/随机分配）
- ✅ 抢红包（防重复抢取）
- ✅ 24小时后退款机制
- ✅ 完整的事件日志
- ✅ 安全检查和错误处理

### 前端功能
- ✅ 钱包连接（MetaMask）
- ✅ ENS 名称显示
- ✅ 网络状态检测
- ✅ 发红包界面
- ✅ 抢红包界面
- ✅ **完整的红包记录追踪** ⭐NEW
- ✅ 实时事件监听
- ✅ 交易状态跟踪
- ✅ 友好的错误提示

### 📊 红包记录功能（新增）
- ✅ **我发出的红包**：
  - 红包基本信息（金额、数量、类型）
  - 当前状态（进行中/已抢完/已结束）
  - 抢夺记录（谁抢了多少）
  - Gas费用详情
  - 交易哈希链接
- ✅ **我抢到的红包**：
  - 获得的金额明细
  - 红包创建者信息
  - 抢夺时间记录
  - Gas费用统计
- ✅ **统计面板**：
  - 发出/抢到红包数量
  - 总金额统计（发出/获得）
  - 累计Gas费用
  - 收支平衡分析
- ✅ **实时数据**：
  - 自动刷新功能
  - 区块链事件监听
  - 交易详情查询

### 子图功能
- ✅ 红包数据索引
- ✅ 用户统计信息
- ✅ 历史记录查询
- ✅ 实时数据同步

## 🔧 使用说明

### 发红包流程
1. 连接 MetaMask 钱包
2. 输入部署的合约地址
3. 设置红包参数：
   - 总金额（ETH）
   - 红包数量（1-100）
   - 类型（均等/随机）
   - 祝福语（可选）
4. 确认交易
5. 获得红包ID，分享给其他人

### 抢红包流程
1. 连接 MetaMask 钱包
2. 输入合约地址和红包ID
3. 查看红包信息
4. 点击抢红包
5. 确认交易获得随机金额

### 📊 查看记录流程（新增）
1. 连接 MetaMask 钱包
2. 输入合约地址
3. 点击"我的记录"选项卡
4. 查看详细的红包统计：
   - **发出的红包**：查看每个红包的详细状态
   - **抢到的红包**：查看获得的金额记录
   - **Gas费用**：所有交易的Gas消耗
   - **收支分析**：总体盈亏情况

## ⚠️ 注意事项

### 安全提醒
- 每个地址只能抢一次相同的红包
- 创建者不能抢自己的红包
- 建议先在测试网测试
- 注意Gas费用（记录模块会显示详细费用）

### 网络支持
- Ethereum 主网
- Sepolia 测试网
- 其他兼容EVM的网络

### 合约限制
- 最小红包金额：0.001 ETH
- 最大红包数量：100个
- 祝福语最长：200字符
- 退款时间：24小时后

## 🎨 自定义配置

### 修改样式
- 所有组件使用 Tailwind CSS
- 可在各组件文件中自定义样式
- 支持响应式设计

### 扩展功能
- 可添加更多红包类型
- 集成其他钱包（WalletConnect等）
- 添加红包历史页面
- 集成通知系统
- **导出记录为CSV** 📊
- **红包数据可视化图表** 📈

## 📊 记录模块技术实现

### 数据源
```javascript
// 从区块链事件获取数据
const createdFilter = contract.filters.RedPackageCreated(null, account);
const grabbedFilter = contract.filters.RedPackageGrabbed(null, account);

// 获取交易详情和Gas费用
const txDetails = await getTransactionDetails(txHash);
const gasCost = ethers.formatEther(gasUsed * gasPrice);
```

### 统计计算
```javascript
// 计算总金额
const totalAmountCreated = records.reduce((sum, record) => 
  sum + parseFloat(record.totalAmount), 0
);

// 计算Gas费用
const totalGasUsed = records.reduce((sum, record) => 
  sum + parseFloat(record.gasCost), 0
);
```

### 实时更新
- 监听区块链事件自动刷新
- 手动刷新按钮
- 缓存机制优化性能

## 📊 子图查询示例

```graphql
# 查询用户红包统计
{
  users(where: {address: "0x..."}) {
    address
    createdRedPackagesCount
    grabbedRedPackagesCount
    totalAmountCreated
    totalAmountGrabbed
  }
}

# 查询用户发出的红包
{
  redPackages(where: {creator: "0x..."}) {
    id
    totalAmount
    remainingAmount
    isEqual
    message
    createTime
    grabRecords {
      grabber {
        address
      }
      amount
    }
  }
}

# 查询用户抢到的红包
{
  grabRecords(where: {grabber: "0x..."}) {
    redPackage {
      id
      creator {
        address
      }
      message
    }
    amount
    timestamp
  }
}
```

## 🎯 记录模块展示内容

### 📈 统计卡片
- **发出红包数量**：创建的红包总数
- **抢到红包数量**：成功抢到的红包数
- **发出总额**：创建红包的总金额
- **获得总额**：抢红包获得的总金额
- **Gas费用**：所有交易消耗的Gas总费用

### 📋 详细记录
- **发出的红包**：
  - 红包ID和创建时间
  - 金额、数量、类型
  - 当前状态和剩余情况
  - 抢夺记录列表
  - 祝福语内容
  - 交易哈希和Gas费用
  
- **抢到的红包**：
  - 红包ID和抢夺时间
  - 获得的具体金额
  - 创建者地址
  - 红包剩余状态
  - 交易详情

### 🔗 外部链接
- 每个交易都提供 Etherscan 链接
- 直接跳转查看区块链详情
- 支持不同网络的浏览器

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 📄 许可证

MIT License

## 🆘 常见问题

**Q: 如何获取测试网ETH？**
A: 访问 Sepolia 水龙头获取测试ETH。

**Q: 记录加载很慢怎么办？**
A: 记录模块需要查询区块链历史事件，首次加载可能较慢，后续访问会有缓存。

**Q: Gas费用显示不准确？**
A: Gas费用计算基于实际交易数据，可能因网络拥堵而有所差异。

**Q: 为什么看不到某个红包的记录？**
A: 确保合约地址正确，且该红包确实是由当前钱包地址创建或抢夺的。

**Q: 如何导出记录数据？**
A: 目前支持复制交易哈希查看详情，后续版本将添加CSV导出功能。

---

🎉 恭喜！你已经成功部署了带有完整记录追踪功能的链上红包系统！

## 📊 记录模块亮点

✨ **完全透明**：所有数据来源于区块链，确保真实性
✨ **详细统计**：从Gas费用到收支分析，一目了然
✨ **实时更新**：支持事件监听和手动刷新
✨ **用户友好**：清晰的界面设计，易于理解
✨ **可扩展**：模块化设计，便于添加新功能
