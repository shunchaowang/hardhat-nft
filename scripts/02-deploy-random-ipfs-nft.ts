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

    // we only want to have 1 confirmation if on localhost and hardhat dev node
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    const RandomIpfsNft = await ethers.getContractFactory("RandomIpfsNft")

    let vrfCoordinatorV2Address
    // we need to get the mock vrf coordinator if we are on the development chain
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContractAt("VRFCoordinatorV2Mock")
    }

    const randomIpfsNft = await RandomIpfsNft.deploy()

    await randomIpfsNft.deployTransaction.wait(waitBlockConfirmations)
    console.log(`Waiting for the block confirmation ${waitBlockConfirmations}`)

    console.log(`Random Ipfs Nft deployed at ${randomIpfsNft.address}`)

    console.log("--------------------------------------")
    const args: any[] = []
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Now verifying...")
        await verify(randomIpfsNft.address, args)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
