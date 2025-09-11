#!/bin/bash

# 🎯 Red Packet Subgraph Quick Deploy Script
# 快速部署红包子图 - 兼容不同版本的 Graph CLI

echo "📊 Red Packet Subgraph Deployment Starting..."
echo "=============================================="

# 检查是否在正确的目录
if [ ! -f "subgraph.yaml" ]; then
    echo "❌ Error: Please run this script from the subgraph directory"
    echo "💡 Run: cd blockchain-data-system/subgraph && ./deploy-subgraph.sh"
    exit 1
fi

# 检查是否安装了 graph CLI
if ! command -v graph &> /dev/null; then
    echo "📦 Installing Graph CLI..."
    npm install -g @graphprotocol/graph-cli
fi

echo "🔧 Graph CLI version: $(graph --version)"

# 选择部署方式
echo ""
echo "🎯 Select deployment option:"
echo "1) Deploy to The Graph Studio (recommended)"
echo "2) Deploy to local Graph Node"
echo "3) Just build and test locally"
read -p "Enter your choice (1-3): " deploy_choice

case $deploy_choice in
    1)
        echo "🌐 Deploying to The Graph Studio..."
        DEPLOY_TARGET="studio"
        ;;
    2)
        echo "🏠 Deploying to local Graph Node..."
        DEPLOY_TARGET="local"
        ;;
    3)
        echo "🧪 Building locally for testing..."
        DEPLOY_TARGET="test"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# 安装依赖
echo ""
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencies already installed"
fi

# 清理旧的构建文件
echo ""
echo "🧹 Cleaning old build files..."
rm -rf build/ generated/

# 生成代码
echo ""
echo "⚡ Generating TypeScript code..."
npm run codegen

if [ $? -ne 0 ]; then
    echo "❌ Code generation failed!"
    exit 1
fi

echo "✅ Code generation completed!"

# 构建子图
echo ""
echo "🔨 Building subgraph..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed!"

# 根据选择进行部署
case $DEPLOY_TARGET in
    "studio")
        echo ""
        echo "🔑 Studio Deployment Setup"
        echo "1. Visit: https://thegraph.com/studio/"
        echo "2. Connect your wallet"
        echo "3. Create a subgraph named 'redpacket-subgraph'"
        echo "4. Copy the deploy key from the studio"
        echo ""
        read -p "Enter your Studio deploy key: " DEPLOY_KEY
        
        if [ -z "$DEPLOY_KEY" ]; then
            echo "❌ Deploy key is required for Studio deployment"
            exit 1
        fi
        
        echo "🔐 Authenticating with Studio..."
        
        # 尝试不同的认证方式
        if graph auth --studio $DEPLOY_KEY 2>/dev/null; then
            echo "✅ Authentication successful (method 1)"
        elif graph auth $DEPLOY_KEY 2>/dev/null; then
            echo "✅ Authentication successful (method 2)"  
        else
            echo "🔧 Trying alternative authentication..."
            # 手动设置环境变量方式
            export GRAPH_ACCESS_TOKEN=$DEPLOY_KEY
            echo "✅ Deploy key set as environment variable"
        fi
        
        echo "🚀 Deploying to Studio..."
        
        # 尝试不同的部署命令
        if graph deploy --studio redpacket-subgraph 2>/dev/null; then
            echo "✅ Deployment successful (method 1)"
        elif graph deploy redpacket-subgraph --access-token $DEPLOY_KEY 2>/dev/null; then
            echo "✅ Deployment successful (method 2)"
        elif GRAPH_ACCESS_TOKEN=$DEPLOY_KEY graph deploy redpacket-subgraph 2>/dev/null; then
            echo "✅ Deployment successful (method 3)"
        else
            echo ""
            echo "⚠️  Automatic deployment failed. Please try manual deployment:"
            echo ""
            echo "📋 Manual deployment steps:"
            echo "1. Set your access token:"
            echo "   export GRAPH_ACCESS_TOKEN=$DEPLOY_KEY"
            echo ""
            echo "2. Deploy with one of these commands:"
            echo "   graph deploy redpacket-subgraph"
            echo "   graph deploy --product hosted-service YOUR_GITHUB_USER/redpacket-subgraph"
            echo "   graph deploy --studio redpacket-subgraph"
            echo ""
            echo "3. Or use the Graph Studio web interface to upload build files"
            echo ""
            exit 1
        fi
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Deployment to Studio completed successfully!"
            echo ""
            echo "📊 Your subgraph endpoints:"
            echo "   Query: https://api.studio.thegraph.com/query/[your-id]/redpacket-subgraph/version/latest"
            echo "   Playground: https://api.studio.thegraph.com/playground/[your-id]/redpacket-subgraph/version/latest"
            echo ""
            echo "💡 Check the Studio dashboard for sync status and endpoint URLs"
        else
            echo "❌ Studio deployment failed!"
            echo ""
            echo "🛠️  Troubleshooting:"
            echo "   • Check your deploy key is correct"
            echo "   • Ensure subgraph name matches: redpacket-subgraph"
            echo "   • Try manual deployment using the commands above"
            exit 1
        fi
        ;;
        
    "local")
        echo ""
        echo "🏠 Local Graph Node Deployment"
        echo "⚠️  Make sure you have a local Graph Node running:"
        echo "   - Graph Node: http://localhost:8020"
        echo "   - IPFS: http://localhost:5001"
        echo "   - PostgreSQL: localhost:5432"
        echo ""
        read -p "Continue with local deployment? (y/N): " continue_local
        
        if [[ $continue_local != [yY] ]]; then
            echo "❌ Local deployment cancelled"
            exit 1
        fi
        
        echo "📡 Creating local subgraph..."
        graph create --node http://localhost:8020/ redpacket-subgraph
        
        echo "🚀 Deploying to local node..."
        graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001 redpacket-subgraph
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Local deployment completed!"
            echo "📊 Local endpoints:"
            echo "   Query: http://localhost:8000/subgraphs/name/redpacket-subgraph"
            echo "   GraphiQL: http://localhost:8000/subgraphs/name/redpacket-subgraph/graphql"
        else
            echo "❌ Local deployment failed!"
            exit 1
        fi
        ;;
        
    "test")
        echo ""
        echo "🧪 Local testing completed!"
        echo "✅ Subgraph built successfully"
        echo ""
        echo "📋 File structure:"
        echo "   📁 generated/ - Generated TypeScript types"
        echo "   📁 build/ - Compiled WebAssembly"
        echo ""
        echo "🎯 Next steps:"
        echo "   1. Review the generated files"
        echo "   2. Test with a local Graph Node"
        echo "   3. Deploy to Studio when ready"
        ;;
esac

echo ""
echo "📊 Subgraph Configuration Summary:"
echo "   📍 Contract: 0x2bB8eaBb0B662E4fA333A9bF119017994194107E"
echo "   🌐 Network: Sepolia"
echo "   📊 Start Block: 7340000"
echo "   📄 Events: RedPackageCreated, RedPackageGrabbed, RedPackageCompleted, RedPackageRefunded"

echo ""
echo "🔍 Test Queries:"
echo ""
echo "# Get all red packets"
echo 'query { redPackageEntities(first: 5) { id creator { id } totalAmount isActive } }'
echo ""
echo "# Get user stats"
echo 'query { users(first: 5) { id createdRedPackagesCount totalAmountCreated } }'
echo ""
echo "# Get global stats"
echo 'query { redPackageStats(id: "global") { totalRedPackages totalAmountDistributed } }'

echo ""
echo "✅ Subgraph deployment script completed!"

# 提示使用说明
if [ "$DEPLOY_TARGET" = "studio" ]; then
    echo ""
    echo "🔗 Integration with frontend:"
    echo "   1. Install: npm install @apollo/client graphql"
    echo "   2. Update your GraphQL endpoint in the app"
    echo "   3. Test queries in the Studio playground"
    echo "   4. Monitor sync status in Studio dashboard"
    echo ""
    echo "🔧 Alternative deployment methods if automated failed:"
    echo "   • Use Graph Studio web interface"
    echo "   • Manual CLI: GRAPH_ACCESS_TOKEN=\$DEPLOY_KEY graph deploy redpacket-subgraph"
    echo "   • Check Graph CLI version: graph --version"
fi
