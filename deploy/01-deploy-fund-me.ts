
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { CONFIRMATIONS, LOCK_TIME, devlopmentChains, networkConfig } from "../helper-hardhat-config";
import { network } from "hardhat";

module.exports = async (hre: HardhatRuntimeEnvironment) => {
    const { firstAccount } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;

    let ethUsdDataFeedAddr;
    let confirmations
    if (devlopmentChains.includes(network.name)) {
        const mockV3Aggregator = await hre.deployments.get("MockV3Aggregator");
        ethUsdDataFeedAddr = mockV3Aggregator.address;
        confirmations = 0;
    } else {
        const chainId = network.config.chainId;
        ethUsdDataFeedAddr = networkConfig[chainId as keyof typeof networkConfig];
        confirmations = CONFIRMATIONS;
    }


    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, ethUsdDataFeedAddr],
        log: true,
        waitConfirmations: confirmations
    });


    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TIME, ethUsdDataFeedAddr],
        }); 
    } else {
        console.log("Network is not sepolia, verification skipped...")
    }

}

module.exports.tags = ["all", "fundme"]