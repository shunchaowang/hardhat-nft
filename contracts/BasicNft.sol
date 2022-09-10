// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {
    string public constant TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    // a token counter, everytime we mint a nft, the counter needs to increment
    // constructor with erc721 name and symbols
    // mint to create the nft
    // get token uri
    uint256 private s_tokenCounter;

    constructor() ERC721("Dogie", "DOG") {
        s_tokenCounter = 0;
    }

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter++);

        return s_tokenCounter;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return TOKEN_URI;
    }
}
