import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create("bscMainnet");

  const treasuryWallet = process.env.MAINNET_TREASURY_WALLET;

  if (!treasuryWallet) {
    throw new Error("MAINNET_TREASURY_WALLET is missing in .env");
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying OCA Token MAINNET with account:", deployer.address);
  console.log("Mainnet treasury wallet:", treasuryWallet);

  const OcaToken = await ethers.getContractFactory("OcaToken");
  const ocaToken = await OcaToken.deploy(treasuryWallet);

  await ocaToken.waitForDeployment();

  const contractAddress = await ocaToken.getAddress();

  console.log("OCA Token MAINNET deployed to:", contractAddress);
  console.log("Name:", await ocaToken.name());
  console.log("Symbol:", await ocaToken.symbol());
  console.log("Total supply:", ethers.formatUnits(await ocaToken.totalSupply(), 18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});