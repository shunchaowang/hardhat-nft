# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

# Set up the project
## Make a copy of the example dotenv config file `cp .env.example .env`
then replace all the configures with the personal info
INFURA_API_KEY is the infura api for mainnet and testnet
ACCOUNT_PRIVATE_KEY is the private key for wallet
ETHERSCAN_API_KEY is the api key on etherscan io, this key applies to both mainnet and testnet

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
# Things to do
## Develop 3 contracts
1. Basic NFT
2. Random IPFS NFT
3. Dynamic SVG NFT