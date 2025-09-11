const RedPackage = artifacts.require("RedPackage");
const fs = require('fs');
const path = require('path');

module.exports = async function (deployer, network, accounts) {
  console.log("🚀 开始部署红包合约...");
  console.log("🌐 网络:", network);
  console.log("👤 部署者:", accounts[0]);

  // 部署RedPackage合约
  await deployer.deploy(RedPackage);
  const redPackageInstance = await RedPackage.deployed();

  console.log("✅ RedPackage 合约部署成功!");
  console.log("📍 合约地址:", redPackageInstance.address);

  // 保存部署信息
  const deployInfo = {
    contractAddress: redPackageInstance.address,
    network: network,
    deployedAt: new Date().toISOString(),
    deployer: accounts[0],
    transactionHash: redPackageInstance.transactionHash
  };

  // 确保目录存在
  const outputDir = path.join(__dirname, '..');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 保存部署信息到JSON文件
  const outputPath = path.join(outputDir, 'redpacket-deployment.json');
  fs.writeFileSync(outputPath, JSON.stringify(deployInfo, null, 2));
  
  console.log("📄 部署信息已保存到 redpacket-deployment.json");

  // 如果是开发网络，做一些测试
  if (network === 'development' || network === 'ganache') {
    console.log("🧪 执行基本测试...");
    
    try {
      // 测试合约基本功能
      const balance = await redPackageInstance.getContractBalance();
      console.log("💰 合约余额:", balance.toString());
      
      const nextId = await redPackageInstance.nextRedPackageId();
      console.log("🆔 下一个红包ID:", nextId.toString());
      
      console.log("✅ 基本测试通过!");
    } catch (error) {
      console.log("❌ 测试失败:", error.message);
    }
  }
};
