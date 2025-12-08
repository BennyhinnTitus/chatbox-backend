import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  if (!process.env.SEPOLIA_RPC_URL || !process.env.PRIVATE_KEY) {
    throw new Error("Please set SEPOLIA_RPC_URL and PRIVATE_KEY in .env");
  }

  // Connect to Sepolia
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying with:", deployer.address);

  // Get contract factory and connect it to deployer
  const RiskAnalysisFactory = await ethers.getContractFactory("RiskAnalysis", deployer);
  const riskAnalysis = await RiskAnalysisFactory.deploy();

  const tx = riskAnalysis.deploymentTransaction();
  if (tx) await tx.wait();

  console.log("RiskAnalysis deployed to:", riskAnalysis.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
