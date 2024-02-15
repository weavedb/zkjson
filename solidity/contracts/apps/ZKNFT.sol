/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ZKIPFS.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

interface VerifierIPFS {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[11] calldata _pubSignals) external view returns (bool);
}

contract ZKNFT is ERC721URIStorage, ZKIPFS {
    uint256 private _nextTokenId;
    uint constant SIZE_PATH = 5;
    uint constant SIZE_VAL = 5;
    
    constructor(address _verifierIPFS) ERC721("ZKNFT", "ZKNFT") {
      verifierIPFS = _verifierIPFS;
    }

    function mint(address to, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }

    function validateQuery(uint[] memory path, uint[] memory zkp) private view returns(uint[] memory){
      verify(zkp, VerifierIPFS.verifyProof.selector, verifierIPFS);
      return _validateQueryIPFS(path, zkp, SIZE_PATH, SIZE_VAL);
    }

    function qString (uint[] memory path, uint[] memory zkp) public view returns (string memory) {
      uint[] memory value = validateQuery(path, zkp);
      return _qString(value);
  }

}
