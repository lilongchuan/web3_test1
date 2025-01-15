import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// require("@chainlink/env-enc").config();
import { config } from '@chainlink/env-enc';
config();
import "./tasks"
import 'hardhat-deploy';

const SEPOLIA_URL = process.env.SEPOLIA_URL ?? "";
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? "";

const config2: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 111
    },
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: {
      hardhat: ETHERSCAN_API_KEY
    }
  },
  namedAccounts: {
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    },
  },
  gasReporter: {
    enabled: false
  }
};

export default config2;
