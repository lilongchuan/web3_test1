import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DECIMAL, INITIAL_ANSWER, devlopmentChains } from "../helper-hardhat-config";


module.exports = async (hre: HardhatRuntimeEnvironment) => {
    if (devlopmentChains.includes(network.name)) {
        const { firstAccount } = await hre.getNamedAccounts();
        const { deploy } = hre.deployments;

        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true
        });
    } else {
        console.log("environment is not local, mock contract depployment is skipped")
    }
}

module.exports.tags = ["all", "mock"]