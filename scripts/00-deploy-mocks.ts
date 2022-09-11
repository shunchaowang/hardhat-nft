import { DECIMALS, INITIAL_PRICE } from"../helper-hardhat-config"
import {DeployFunction} from "hardhat-deploy/types"
import {HardhatRuntimeEnvironment} from "hardhat/types"

const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas

const deployMocks: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
  ) {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })

        log("Mocks Deployed!")
        log("----------------------------------")
        log("You are deploying to a local network, you'll need a local network running to interact")
        log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        )
        log("----------------------------------")
    }
}
export default deployMocks
deployMocks.tags = ["all", "mocks", "main"]

// since we are using vrf chainlink call, we need to mock the vrf endpoint
import { ethers, network } from "hardhat"
import {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config"
import verify from "../utils/verify"

import * as dotenv from "dotenv"

dotenv.config()

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log(`Deploying contracts with the account ${deployer.address}`)
    console.log(`Account balance: ${(await deployer.getBalance()).toString()}`)

    // deploy vrf coordinator
    // deploy aggregator

    // we only want to have 1 confirmation if on localhost and hardhat dev node
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    console.log()

    // If we are on a local development network, we need to deploy mocks!
    const chainId = network.config.chainId
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })

        log("Mocks Deployed!")
        log("----------------------------------")
        log("You are deploying to a local network, you'll need a local network running to interact")
        log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        )
        log("----------------------------------")

    const basicNftContract = await ethers.getContractFactory("BasicNft")
    const nft = await basicNftContract.deploy()

    await nft.deployTransaction.wait(waitBlockConfirmations)
    console.log(`Waiting for the block confirmation ${waitBlockConfirmations}`)

    console.log(`Nft deployed at ${nft.address}`)

    console.log("--------------------------------------")
    const args: any[] = []
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Now verifying...")
        await verify(nft.address, args)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
