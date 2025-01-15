import { task } from "hardhat/config";
import { FundMe } from "../typechain-types/contracts/FundMe";

task("interact-fundme", "interact with fundme contract")
    .addParam("addr", "fundme contract address")
    .setAction(async (taskArgs, hre) => {

        const { ethers } = hre;

        const fundMeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = fundMeFactory.attach(taskArgs.addr) as FundMe

        // init 2 accounts
        const [firstAccount, secondAccount] = await ethers.getSigners()
        console.log(`firstAccount ${firstAccount?.address}`)
        console.log(`secondAccount ${secondAccount?.address}`)

        // fund contract with first account
        const fundTx = await fundMe.fund({ value: ethers.parseEther("0.1") })
        await fundTx.wait()

        // check balance of contract
        const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
        console.log(`Balance of the contract is ${balanceOfContract}`)

        // fund contract with second account
        const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({ value: ethers.parseEther("0.2") })
        await fundTxWithSecondAccount.wait()

        // check balance of contract
        const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
        console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`)
 

        // check mapping 
        const firstAccountbalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
        console.log(`Balance of first account ${firstAccount.address} is ${firstAccountbalanceInFundMe}`)

        const secondAccountbalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
        console.log(`Balance of second account ${secondAccount.address} is ${secondAccountbalanceInFundMe}`)
    })

module.exports = {}