// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "./ZKQuery.sol";
import "hardhat/console.sol";

interface VerifierIPFS {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[43] calldata _pubSignals) external view returns (bool);
}

contract ZKIPFS is ZKQuery{
  uint constant SIZE_PATH = 5;
  uint constant SIZE_VAL = 5;
  address public verifierIPFS;
  bytes constant ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  
  function charArrayToString(bytes1[46] memory charArray) public pure returns (string memory) {
    bytes memory byteArray = new bytes(charArray.length);
    for(uint i = 0; i < charArray.length; i++) {
      byteArray[i] = charArray[i];
    }
    return string(byteArray);
  }

  function concat(string memory a, string memory b) public pure returns (string memory) {
    return string(abi.encodePacked(a, b));
  }
  
  function uriEqual(string memory a, string memory b) public pure returns (bool) {
    return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
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
  
  function ipfsURI(uint[34] memory source) public pure returns (string memory) {
    return concat("ipfs://", toCID(source));
  }
  
  function _validateQueryIPFS(uint[] memory path, uint[] memory zkp, uint size_path, uint size_val) internal pure returns(uint[] memory){
    require(zkp[8] == 1, "value doesn't exist");
    uint len = 41;
    for(uint i = len; i < len + size_path; i++){
      require((path.length <= i - len && zkp[i] == 0) || path[i - len] == zkp[i], "wrong path");
    }
    uint[] memory value = new uint[](size_val);
    for(uint i = len + size_path; i < len + size_path + size_val; i++){
      value[i - (len + size_val)] = zkp[i];
    }
    return toArr(value);
  }
  
  function validateQuery(string memory URI, uint[] memory path, uint[] memory zkp) internal view returns(uint[] memory){
    uint[34] memory hash;
    hash[0] = 18;
    hash[1] = 32;
    for(uint i = 9; i < 41; i++) hash[i - 7] = zkp[i];
    string memory CID = ipfsURI(hash);
    require(uriEqual(CID,URI), "wrong CID");
    verify(zkp, VerifierIPFS.verifyProof.selector, verifierIPFS);
    return _validateQueryIPFS(path, zkp, SIZE_PATH, SIZE_VAL);
  }

}
