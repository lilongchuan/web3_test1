import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io",
      accounts: ["5723009fa0f5963613fccefab677bb945b6d409609a8f792a63f1ac9e68958ca"],
      chainId: 11155111,
    }
  }
};

export default config;
