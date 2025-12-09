import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with:", await deployer.getAddress());

  const RiskAnalysisFactory = await ethers.getContractFactory("RiskAnalysis");
  const riskAnalysis = await RiskAnalysisFactory.deploy();

  await riskAnalysis.waitForDeployment();

  console.log("RiskAnalysis deployed to:", await riskAnalysis.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
