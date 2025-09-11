const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 开始部署红包合约...");

  // 获取签名者 - 修复这里的错误
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers available. Please check your private key configuration.");
  }
  
  const deployer = signers[0];
  console.log("👤 部署账户:", deployer.address);

  // 获取账户余额
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 账户余额:", hre.ethers.formatEther(balance), "ETH");

  // 检查余额是否足够
  if (balance === 0n) {
    throw new Error("Deployer account has no ETH. Please fund your account first.");
  }

  // 部署RedPackage合约
  console.log("📜 开始部署 RedPackage 合约...");
  const RedPackage = await hre.ethers.getContractFactory("RedPackage");
  
  // 估算部署Gas费用
  const deploymentData = RedPackage.interface.encodeDeploy([]);
  const estimatedGas = await hre.ethers.provider.estimateGas({
    data: deploymentData
  });
  console.log("⛽ 预估Gas用量:", estimatedGas.toString());

  const redPackage = await RedPackage.deploy();

  // 等待部署交易被挖出
  const deployTx = redPackage.deploymentTransaction();
  console.log("⏳ 等待交易确认...");
  console.log("🔗 部署交易哈希:", deployTx.hash);
  
  await redPackage.waitForDeployment();
  const contractAddress = await redPackage.getAddress();
  
  console.log("✅ RedPackage 合约部署成功!");
  console.log("📍 合约地址:", contractAddress);
  console.log("🌐 网络:", hre.network.name);
  console.log("⛽ Gas Price:", hre.ethers.formatUnits(deployTx.gasPrice || 0, "gwei"), "Gwei");

  // 等待几个区块确认后验证合约
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ 等待区块确认...");
    await deployTx.wait(3); // 等待3个区块确认
    
    try {
      console.log("🔍 开始验证合约...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ 合约验证成功!");
    } catch (error) {
      console.log("❌ 合约验证失败:", error.message);
      console.log("💡 你可以稍后手动验证合约");
    }
  }

  // 保存部署信息
  const deployInfo = {
    contractName: "RedPackage",
    contractAddress: contractAddress,
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    deploymentTxHash: deployTx.hash,
    gasPrice: deployTx.gasPrice ? hre.ethers.formatUnits(deployTx.gasPrice, "gwei") + " Gwei" : "N/A",
    gasUsed: estimatedGas.toString(),
    deployedAt: new Date().toISOString(),
    blockNumber: deployTx.blockNumber || "pending"
  };

  // 保存到JSON文件
  const outputPath = path.join(__dirname, '..', 'redpacket-deployment.json');
  fs.writeFileSync(outputPath, JSON.stringify(deployInfo, null, 2));
  console.log("📄 部署信息已保存到:", outputPath);

  // 如果是测试网络，执行一些基本测试
  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    console.log("\n🧪 执行基本功能测试...");
    
    try {
      // 测试获取合约余额
      const contractBalance = await redPackage.getContractBalance();
      console.log("💰 合约当前余额:", hre.ethers.formatEther(contractBalance), "ETH");
      
      // 测试获取下一个红包ID
      const nextId = await redPackage.nextRedPackageId();
      console.log("🆔 下一个红包ID:", nextId.toString());
      
      console.log("✅ 基本功能测试通过!");
    } catch (error) {
      console.log("❌ 功能测试失败:", error.message);
    }
  }

  console.log("\n🎉 部署完成!");
  console.log("🔗 在前端中使用此合约地址:", contractAddress);
  
  return contractAddress;
}

// 执行部署
main()
  .then((address) => {
    console.log(`\n📋 快速复制合约地址: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ 部署失败:", error.message);
    if (error.stack) {
      console.error("🔍 错误详情:", error.stack);
    }
    process.exit(1);
  });
