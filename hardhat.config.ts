import { HardhatUserConfig } from "hardhat/config";
import "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";

import * as dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;

const config: HardhatUserConfig = {
  w3f: {
    rootDir: "./web3-functions",
    debug: false,
    networks: ["baseSepolia"],
  },
  solidity: {
    compilers: [
      {
        version: "0.8.26",
        settings: {
          optimizer: { enabled: true, runs: 999999 },
          evmVersion: "paris",
        },
      },
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    pyth: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      84532: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      8453: "0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a",
    },
  },
  networks: {
    devnet: {
      chainId: 900,
      url: "http://127.0.0.1:8545",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    baseSepolia: {
      chainId: 84532,
      url: "https://sepolia.base.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    base: {
      chainId: 8453,
      url: "https://mainnet.base.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_KEY,
    },
  },
};

export default config;
