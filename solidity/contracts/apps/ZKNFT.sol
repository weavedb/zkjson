/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ZKIPFS.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

interface VerifierIPFS {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[43] calldata _pubSignals) external view returns (bool);
}

contract ZKNFT is ERC721URIStorage, ZKIPFS {
  uint256 private _nextTokenId;
  uint constant SIZE_PATH = 5;
  uint constant SIZE_VAL = 5;
  bytes constant ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
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

  function charArrayToString(bytes1[46] memory charArray) public pure returns (string memory) {
    bytes memory byteArray = new bytes(charArray.length);
    for(uint i = 0; i < charArray.length; i++) {
      byteArray[i] = charArray[i];
    }
    return string(byteArray);
  }
  
  function toCID(uint[34] memory source) public pure returns (string memory) {
    uint zeroes = 0;
    uint length = 0;
    uint pbegin = 0;
    uint pend = source.length;
    while (pbegin != pend && source[pbegin] == 0) {
      pbegin++;
      zeroes++;
    }
    uint size = 46;
    uint[46] memory b58;
    while (pbegin != pend) {
      uint carry = source[pbegin];
      uint i = 0;
      for ( uint it1 = size - 1; (carry != 0 || i < length); it1-- ) {
	carry += (256 * b58[it1]);
	b58[it1] = carry % 58;
	carry = (carry / 58);
	i++;
	if(it1 == 0) break;
      }
      length = i;
      pbegin++;
    }
    uint it2 = size - length;
    while (it2 != size && b58[it2] == 0) it2++;
    bytes1[46] memory str;
    uint i = 0;
    for (; it2 < size; ++it2){
      str[i] = ALPHABET[b58[it2]];
      i++;
    }
    return charArrayToString(str);
  }
  
  function concat(string memory a, string memory b) public pure returns (string memory) {
    return string(abi.encodePacked(a, b));
  }
  
  function isEqual(string memory a, string memory b) public pure returns (bool) {
    return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
  }
  function query (uint tokenId, uint[] memory path, uint[] memory zkp) public view returns (string memory) {
    uint[34] memory hash;
    hash[0] = 18;
    hash[1] = 32;
    for(uint i = 9; i < 41; i++) hash[i - 7] = zkp[i];
    string memory CID = concat("ipfs://", toCID(hash));
    string memory URI = tokenURI(tokenId);
    require(isEqual(CID,URI), "wrong CID");
    return qString(path, zkp);
      
  }
  function qString (uint[] memory path, uint[] memory zkp) public view returns (string memory) {
    uint[] memory value = validateQuery(path, zkp);
    return _qString(value);
  }

}
