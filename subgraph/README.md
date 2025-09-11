# 📊 红包子图部署指南

## 🌟 概述

这个子图会索引你的红包合约的所有事件和数据，让前端可以快速查询：
- 用户红包记录
- 统计数据
- 历史交易
- 实时数据同步

## 🚀 部署步骤

### 1. 安装 Graph CLI

```bash
# 全局安装 Graph CLI
npm install -g @graphprotocol/graph-cli

# 验证安装
graph --version
```

### 2. 访问 The Graph Studio

```bash
# 访问 The Graph Studio
https://thegraph.com/studio/
```

1. **连接钱包**（用你部署合约的钱包）
2. **创建新子图**：
   - 点击 "Create a Subgraph"
   - 名称：`redpacket-subgraph`
   - 网络：`Sepolia`

### 3. 认证和初始化

```bash
cd blockchain-data-system/subgraph

# 从 Studio 获取认证密钥并登录
graph auth --studio YOUR_DEPLOY_KEY

# 安装依赖
npm install
```

### 4. 生成代码

```bash
# 生成 TypeScript 代码
npm run codegen

# 或者直接使用 graph cli
graph codegen
```

### 5. 构建子图

```bash
# 构建子图
npm run build

# 或者
graph build
```

### 6. 部署到 Studio

```bash
# 部署子图
npm run deploy

# 或者
graph deploy --studio redpacket-subgraph
```

## ⚙️ 配置说明

### 当前配置
```yaml
# subgraph.yaml 中的配置
network: sepolia
address: "0x2bB8eaBb0B662E4fA333A9bF119017994194107E"
startBlock: 7340000
```

### 🔧 如果需要更新配置

如果你的合约地址不同，请更新 `subgraph/subgraph.yaml`：

```yaml
dataSources:
  - kind: ethereum
    name: RedPackage
    network: sepolia
    source:
      address: "你的合约地址"  # 更新这里
      abi: RedPackage
      startBlock: 你的起始区块号    # 更新这里
```

## 📊 查询示例

部署成功后，你可以使用以下 GraphQL 查询：

### 查询所有红包
```graphql
{
  redPackageEntities(first: 10, orderBy: createTime, orderDirection: desc) {
    id
    creator {
      id
      address
    }
    totalAmount
    remainingAmount
    totalCount
    remainingCount
    isEqual
    createTime
    isActive
    message
    grabRecords {
      grabber {
        id
      }
      amount
      timestamp
    }
  }
}
```

### 查询用户统计
```graphql
{
  users(first: 10, orderBy: totalAmountCreated, orderDirection: desc) {
    id
    address
    createdRedPackagesCount
    grabbedRedPackagesCount
    totalAmountCreated
    totalAmountGrabbed
    firstRedPackageTime
    lastRedPackageTime
  }
}
```

### 查询特定用户的红包
```graphql
{
  user(id: "0x用户地址") {
    id
    address
    createdRedPackages {
      id
      totalAmount
      isActive
      createTime
    }
    grabRecords {
      redPackage {
        id
      }
      amount
      timestamp
    }
  }
}
```

### 查询全局统计
```graphql
{
  redPackageStats(id: "global") {
    totalRedPackages
    totalUsers
    totalAmountDistributed
    totalGrabRecords
    equalRedPackagesCount
    randomRedPackagesCount
    lastUpdated
  }
}
```

### 查询每日统计
```graphql
{
  dailyRedPackageStats(first: 7, orderBy: date, orderDirection: desc) {
    id
    date
    redPackagesCreated
    totalAmountCreated
    grabRecordsCount
    totalAmountGrabbed
    newUsers
  }
}
```

## 🔍 获取 Deploy Key

在 The Graph Studio 中：

1. **创建子图后**，你会看到一个页面显示：
```bash
graph auth --studio <YOUR_DEPLOY_KEY>
```

2. **复制这个密钥**并在终端中运行认证命令

## 🌐 子图端点

部署成功后，你会获得两个端点：

### 查询端点（用于前端）
```
https://api.studio.thegraph.com/query/[subgraph-id]/redpacket-subgraph/version/latest
```

### Playground端点（用于测试）
```
https://api.studio.thegraph.com/playground/[subgraph-id]/redpacket-subgraph/version/latest
```

## 🔧 集成到前端

在你的前端应用中使用子图：

### 1. 安装依赖
```bash
npm install @apollo/client graphql
```

### 2. 配置 Apollo Client
```javascript
// src/apollo/client.js
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/[your-subgraph-id]/redpacket-subgraph/version/latest',
  cache: new InMemoryCache(),
});

export default client;
```

### 3. 查询示例
```javascript
// src/hooks/useRedPackets.js
import { useQuery, gql } from '@apollo/client';

const GET_RED_PACKETS = gql`
  query GetRedPackets($first: Int!, $skip: Int!) {
    redPackageEntities(
      first: $first
      skip: $skip
      orderBy: createTime
      orderDirection: desc
    ) {
      id
      creator {
        id
      }
      totalAmount
      remainingAmount
      totalCount
      remainingCount
      isEqual
      createTime
      isActive
      message
    }
  }
`;

export function useRedPackets(page = 0, pageSize = 10) {
  const { loading, error, data } = useQuery(GET_RED_PACKETS, {
    variables: {
      first: pageSize,
      skip: page * pageSize,
    },
    pollInterval: 5000, // 每5秒刷新一次
  });

  return {
    loading,
    error,
    redPackets: data?.redPackageEntities || [],
  };
}
```

## 🛠️ 故障排除

### 常见错误及解决方案

#### 1. "Failed to deploy to Studio"
```bash
# 确保已正确认证
graph auth --studio YOUR_DEPLOY_KEY

# 检查网络连接
ping thegraph.com
```

#### 2. "Build failed"
```bash
# 清理并重新构建
rm -rf build/ generated/
npm run codegen
npm run build
```

#### 3. "Start block too low"
```bash
# 在 subgraph.yaml 中设置更高的起始区块
source:
  startBlock: 7350000  # 设置为你的合约部署区块或更高
```

#### 4. "Sync failed"
```bash
# 检查合约地址是否正确
# 检查网络是否匹配
# 检查 ABI 是否与合约匹配
```

## 📈 监控子图状态

部署后可以在 Studio 中监控：

- **同步状态**：显示是否跟上最新区块
- **索引进度**：显示处理了多少事件
- **查询数量**：API 调用统计
- **错误日志**：如果有同步问题

## 🎯 下一步

1. **部署子图**
2. **测试查询**
3. **集成到前端**
4. **监控性能**
5. **优化查询**

## 💡 提示

- 子图同步需要一些时间，请耐心等待
- 可以在 Playground 中测试查询
- 建议使用分页查询来提高性能
- 可以设置查询轮询来实时更新数据

## 🎉 成功标志

如果看到以下内容说明部署成功：
- ✅ Studio 中显示 "Synced"
- ✅ Playground 可以执行查询
- ✅ 前端能获取到数据

现在你的红包系统有了强大的数据索引能力！🚀
