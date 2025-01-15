import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.deploy(180,"");
    await fundMe.waitForDeployment();


    console.log("FundMe target:", fundMe.target);
    console.log("1111:", hre.network.config.chainId);

    // verify fundme
    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for 5 confirmations")
        await fundMe.deploymentTransaction()?.wait(5)
        await verifyFundMe(fundMe.target, [300])
    } else {
        console.log("verification skipped..")
    }

}

async function verifyFundMe(fundMeAddr: any, args: any) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}


main().then().catch((error) => {
    console.log(`error:${error}`);
    process.exit(0);
});