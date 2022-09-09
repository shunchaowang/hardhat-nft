import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config()

const INFURA_API_KEY = process.env.INFURA_API_KEY
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    networks: {
        gorli: {
            url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [`${ACCOUNT_PRIVATE_KEY}`],
        },
    },
}

export default config
