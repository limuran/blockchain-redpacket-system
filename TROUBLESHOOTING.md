# 🚀 项目启动问题修复指南

## 🔧 当前遇到的问题
你遇到的错误主要是由于Node.js polyfill和模块解析问题导致的。

## 💡 快速解决方案

### 1️⃣ 清理并重新安装依赖
```bash
# 删除现有依赖和缓存
rm -rf node_modules
rm -rf .next
rm package-lock.json  # 如果有的话
rm yarn.lock          # 如果有的话

# 重新安装依赖
npm install

# 或者使用 yarn
yarn install
```

### 2️⃣ 检查环境
确保你的环境满足要求：
```bash
# 检查 Node.js 版本 (需要 18+)
node --version

# 检查 npm 版本
npm --version

# 如果版本过低，升级 Node.js
# 推荐使用 nvm 管理 Node.js 版本
```

### 3️⃣ 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 文件，至少设置：
# NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
# NEXT_PUBLIC_SUBGRAPH_URL=your_subgraph_url
```

### 4️⃣ 启动开发服务器
```bash
# 清理构建缓存并启动
npm run dev

# 如果还有问题，尝试
npx next dev --turbo
```

## 🐛 常见问题排查

### 问题1: 模块找不到
```bash
# 解决方案：重新安装依赖
npm install
```

### 问题2: 端口被占用
```bash
# 解决方案：使用不同端口
npm run dev -- -p 3001
```

### 问题3: 权限问题 (macOS/Linux)
```bash
# 解决方案：修复权限
sudo chown -R $(whoami) ~/.npm
```

### 问题4: Windows 路径问题
```bash
# 解决方案：使用 PowerShell 或 Git Bash
# 避免使用 CMD
```

## 🔄 如果问题仍然存在

### 方案A: 完全重置
```bash
# 1. 备份你的 .env.local 文件
cp .env.local .env.backup

# 2. 完全清理项目
rm -rf node_modules .next package-lock.json yarn.lock

# 3. 重新克隆项目
cd ..
git clone https://github.com/limuran/blockchain-redpacket-system.git fresh-copy
cd fresh-copy

# 4. 恢复环境变量
cp ../blockchain-redpacket-system/.env.backup .env.local

# 5. 安装依赖
npm install

# 6. 启动项目
npm run dev
```

### 方案B: 使用Docker (如果本地环境有问题)
```bash
# 创建 Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
EOF

# 构建并运行
docker build -t redpacket-app .
docker run -p 3000:3000 redpacket-app
```

## 📞 需要帮助？

如果以上方案都无法解决问题，请：

1. **截图完整的错误信息**
2. **提供你的系统环境**：
   - 操作系统
   - Node.js 版本
   - npm 版本
3. **描述你执行的步骤**

我会帮你进一步排查问题！

## 🎯 预期结果

修复后，你应该看到：
```bash
✓ Ready in 2.3s
✓ Local:        http://localhost:3000
✓ Network:      http://192.168.1.xxx:3000

○ (Static)  automatically rendered as static HTML (uses no initial props)
```

然后可以访问 http://localhost:3000 查看红包系统界面！🎉