import { config as dotenvConfig } from "dotenv";
import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";

dotenvConfig();

const BSC_MAINNET_RPC_URL =
  process.env.BSC_MAINNET_RPC_URL || "https://bsc-dataseed.bnbchain.org";

const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY || "";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

export default defineConfig({
  plugins: [
    hardhatToolboxMochaEthersPlugin,
    hardhatVerify,
  ],

  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    bscMainnet: {
      type: "http",
      chainType: "generic",
      url: BSC_MAINNET_RPC_URL,
      chainId: 56,
      accounts: MAINNET_PRIVATE_KEY !== "" ? [MAINNET_PRIVATE_KEY] : [],
    },
  },

  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY,
    },
  },
});