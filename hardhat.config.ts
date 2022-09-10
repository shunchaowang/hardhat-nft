import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config()

const INFURA_API_KEY = process.env.INFURA_API_KEY || ""
const ACCOUNT_PRIVATE_KEY =
    process.env.ACCOUNT_PRIVATE_KEY ||
    "https://eth-rinkeby.alchemyapi.io/v2/your-api-key"

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
            {
                version: "0.8.9",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        gorli: {
            url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [`${ACCOUNT_PRIVATE_KEY}`],
            chainId: 420,
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
}

export default config
