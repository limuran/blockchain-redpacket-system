# 🚨 紧急修复指南

## 当前问题
`core-js/modules/es.symbol.js` 模块找不到的错误。

## 🛠️ 立即执行以下步骤：

### 步骤1: 停止服务器并清理
```bash
# Ctrl+C 停止当前服务器

# 彻底清理
rm -rf node_modules
rm -rf .next
rm -rf package-lock.json
rm -rf yarn.lock
```

### 步骤2: 添加缺失的polyfill依赖
```bash
# 安装必要的polyfill包
npm install crypto-browserify stream-browserify url browserify-zlib stream-http https-browserify assert os-browserify path-browserify

# 安装核心依赖
npm install core-js@latest

# 完整安装
npm install
```

### 步骤3: 如果npm install有问题，尝试
```bash
npm install --legacy-peer-deps
# 或者
npm install --force
```

### 步骤4: 重新启动
```bash
npm run dev
```

## 🔄 替代方案

如果上面的方法还是不行，尝试使用yarn：

```bash
# 安装yarn (如果没有)
npm install -g yarn

# 使用yarn安装依赖
yarn install

# 启动项目
yarn dev
```

## 📞 最后手段

如果还是有问题，执行完全重置：

```bash
# 1. 备份环境变量
cp .env.local .env.backup

# 2. 删除项目文件夹，重新克隆
cd ..
rm -rf blockchain-redpacket-system
git clone https://github.com/limuran/blockchain-redpacket-system.git
cd blockchain-redpacket-system

# 3. 恢复环境变量
cp .env.backup .env.local

# 4. 安装依赖
npm install --legacy-peer-deps

# 5. 启动
npm run dev
```

## 💡 预期结果
成功后应该看到：
```
✓ Ready in 3.2s
✓ Local: http://localhost:3000
```

现在请执行步骤1-4，如果还有问题请告诉我！