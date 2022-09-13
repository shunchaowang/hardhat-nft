import { ethers, network } from "hardhat"
import {
    developmentChains,
    networkConfig,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config"
import verify from "../utils/verify"
import { storeImages } from "../utils/uploadToPinata"

import * as dotenv from "dotenv"
import { string } from "hardhat/internal/core/params/argumentTypes"

dotenv.config()

let tokenUris: string[] = [
    "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
    "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
    "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
]

const imagesLocation = "./images/random-nft/"

const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas

async function main() {
    const [deployer] = await ethers.getSigners()
    const chainId = network.config.chainId!
    console.log(`Deploying contracts with the account ${deployer.address}`)
    console.log(`Account balance: ${(await deployer.getBalance()).toString()}`)

    // get the ipfs hashes of our images
    if (process.env.upload_to_pinata === "true") {
        tokenUris = await handleTokenUris()
    }

    // 1. with our own ipfs node https://docs.ipfs.io/
    // 2. Pinata https://www.pinata.cloud/ we will use this one here
    // 3. nft.storage https://nft.storage/

    // we only want to have 1 confirmation if on localhost and hardhat dev node
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    let vrfCoordinatorV2Address, subscriptionId
    // we need to get the mock vrf coordinator if we are on the development chain
    if (developmentChains.includes(network.name)) {
        console.log("Local network detected! Deploying mocks...")
        const VRFCoordinatorV2Mock = await ethers.getContractFactory(
            "VRFCoordinatorV2Mock"
        )
        const vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.deploy(
            BASE_FEE,
            GAS_PRICE_LINK
        )

        await vrfCoordinatorV2Mock.deployTransaction.wait(
            waitBlockConfirmations
        )
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        console.log(
            `VRFCoordinatorV2Mock deployed at ${vrfCoordinatorV2Mock.address}`
        )
        const transactionResponse =
            await vrfCoordinatorV2Mock.createSubscription()
        // const transactionReceipt = await transactionResponse.wait()
        // subscriptionId = transactionReceipt.events[0].args.subId
        subscriptionId = transactionResponse
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    console.log("-----------------------------------")
    storeImages(imagesLocation)
    const args: any[] = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
        // tokenUris,
        networkConfig[chainId].mintFee,
    ]
    const RandomIpfsNft = await ethers.getContractFactory("RandomIpfsNft")

    // const randomIpfsNft = await RandomIpfsNft.deploy()

    // await randomIpfsNft.deployTransaction.wait(waitBlockConfirmations)
    // console.log(`Waiting for the block confirmation ${waitBlockConfirmations}`)

    // console.log(`Random Ipfs Nft deployed at ${randomIpfsNft.address}`)

    console.log("--------------------------------------")

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Now verifying...")
        // await verify(randomIpfsNft.address, args)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

async function handleTokenUris() {
    tokenUris = []
    // store the images in ipfs
    // store the metadata in ipfs
    tokenUris = await storeImages(imagesLocation)
    console.log(tokenUris)
    return tokenUris
}
