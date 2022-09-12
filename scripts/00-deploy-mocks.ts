import { ethers, network } from "hardhat"
import {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    DECIMALS,
    INITIAL_PRICE
} from "../helper-hardhat-config"

import * as dotenv from "dotenv"

dotenv.config()

const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas

// since we are using vrf chainlink call, we need to mock the vrf endpoint

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

    // If we are on a local development network, we need to deploy mocks!
    const chainId = network.config.chainId
    if (chainId == 31337) {
        console.log("Local network detected! Deploying mocks...")
        const VRFCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock")
        const vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.deploy(BASE_FEE, GAS_PRICE_LINK)

        await vrfCoordinatorV2Mock.deployTransaction.wait(waitBlockConfirmations)
        console.log(`VRFCoordinatorV2Mock deployed at ${vrfCoordinatorV2Mock.address}`)

        const MockAggregator = await ethers.getContractFactory("MockAggregator")
        const mockAggregator = await MockAggregator.deploy()

        await mockAggregator.deployTransaction.wait(waitBlockConfirmations)
        console.log(`MockAggregator deployed at ${mockAggregator.address}`)

        console.log("Mocks Deployed!")
        console.log("----------------------------------")
        console.log("You are deploying to a local network, you'll need a local network running to interact")
        console.log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        )
        console.log("----------------------------------")

    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

