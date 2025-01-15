import { task } from "hardhat/config";

task("deploy-fundme", "deploy and verify fundme conract").setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.deploy(180);
    await fundMe.waitForDeployment();


    console.log("FundMe target:", fundMe.target);
    console.log("1111:", hre.network.config.chainId);

    // verify fundme
    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for 5 confirmations")
        await fundMe.deploymentTransaction()?.wait(5)

        await hre.run("verify:verify", {
            address: fundMe.target,
            constructorArguments: [300],
        });
    } else {
        console.log("verification skipped..")
    }
});

 
module.exports = {};