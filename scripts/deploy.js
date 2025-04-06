const hre = require("hardhat");

async function main() {
  console.log("Deploying KaimaiToken...");

  const KaimaiToken = await hre.ethers.getContractFactory("KaimaiToken");
  const token = await KaimaiToken.deploy();

  await token.deployed();

  console.log("KaimaiToken deployed to:", token.address);
  console.log("Initial supply:", await token.INITIAL_SUPPLY());
  console.log("Maximum supply:", await token.MAX_SUPPLY());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 