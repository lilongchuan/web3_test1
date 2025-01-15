import { deployments, ethers, getNamedAccounts } from "hardhat";
import { assert, expect } from "chai";
import { FundMe } from "../../typechain-types/contracts/FundMe";
import { Address, Deployment } from "hardhat-deploy/dist/types";
import { time, mine } from "@nomicfoundation/hardhat-network-helpers";
import * as he from "@nomicfoundation/hardhat-network-helpers";

describe("test fundme contract", function () {
    let fundMe: FundMe;
    let fundMeSecondAccount: FundMe;
    let firstAccount: Address;
    let secondAccount: Address;
    let mockV3Aggregator: Deployment
    beforeEach(async function () {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount
        const fundMeDeployment = await deployments.get("FundMe")
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
        fundMeSecondAccount = await ethers.getContractAt("FundMe", secondAccount)
    });


    it("test if the owner is msg.sender", async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()), firstAccount)
    });

    it("test if the datafeed is assigned correctly", async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()), mockV3Aggregator.address)
    });

    it("window closed, value grater than minimum, fund failed", async function () {

        // await he.time.increase(200)
        // await mine()
        var fund = await fundMe.fund({ value: ethers.parseEther("0.1") });

        expect(fund).to.be.revertedWith("window is closed1");
    });

    it("Send more ETH", async function () {
        expect( fundMe.fund({ value: ethers.parseEther("0.01") }))
            .to.be.revertedWith("Send more ETH");
    });

    it("Window open, value is greater minimum, fund success", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        const balance = await fundMe.fundersToAmount(firstAccount);
        expect(balance).to.equal(ethers.parseEther("0.1"));
    });

    it("not onwer, window closed, target reached, getFund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("1") });

        // await he.time.increase(100);
        // await mine();

        expect(await fundMeSecondAccount.getFund())
            .to.be.revertedWith("this function can only be called by owner");
    });


});