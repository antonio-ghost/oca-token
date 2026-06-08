import { config as dotenvConfig } from "dotenv";
import { network } from "hardhat";

dotenvConfig();

const OCA_TOKEN_MAINNET_ADDRESS = process.env.OCA_TOKEN_MAINNET_ADDRESS || "";
const PANCAKE_PAIR_ADDRESS = process.env.PANCAKE_PAIR_ADDRESS || "";

if (!OCA_TOKEN_MAINNET_ADDRESS) {
  throw new Error("Missing OCA_TOKEN_MAINNET_ADDRESS in .env");
}

if (!PANCAKE_PAIR_ADDRESS) {
  throw new Error("Missing PANCAKE_PAIR_ADDRESS in .env");
}

const { ethers } = await network.create("bscMainnet");

console.log("OCA Token:", OCA_TOKEN_MAINNET_ADDRESS);
console.log("Pancake Pair:", PANCAKE_PAIR_ADDRESS);

const [owner] = await ethers.getSigners();
console.log("Owner wallet:", owner.address);

const ocaToken = await ethers.getContractAt(
  "OcaToken",
  OCA_TOKEN_MAINNET_ADDRESS
);

const currentPair = await ocaToken.pancakePair();
console.log("Current pair:", currentPair);

const tx = await ocaToken.setPancakePair(PANCAKE_PAIR_ADDRESS);
console.log("Transaction sent:", tx.hash);

await tx.wait();

const newPair = await ocaToken.pancakePair();
console.log("New pair:", newPair);

console.log("Pancake pair set successfully.");