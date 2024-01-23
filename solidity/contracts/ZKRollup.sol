// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "hardhat/console.sol";
import "./ZKQuery.sol";

interface VerifierRU {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[11] calldata _pubSignals) view external returns (bool);

}

contract ZKRollup is ZKQuery {
  address public verifierRU;
  address public committer;
  uint public root;
  
  function _verifyRU(uint[] calldata zkp) internal view returns (bool) {
    uint[2] memory _pA;
    uint[2][2] memory _pB;
    uint[2] memory _pC;
    uint[11] memory sigs;
    for(uint i = 0; i < 2; i++) _pA[i] = zkp[i];
    for(uint i = 2; i < 4; i++) _pB[0][i - 2] = zkp[i];
    for(uint i = 4; i < 6; i++) _pB[1][i - 4] = zkp[i];
    for(uint i = 6; i < 8; i++) _pC[i - 6] = zkp[i];
    for(uint i = 8; i < 19; i++) sigs[i - 8] = zkp[i];
    require(VerifierRU(verifierRU).verifyProof(_pA, _pB, _pC, sigs), "invalid proof");
    return true;
  }
  
  function _validateQueryRU(uint[] memory path, uint[] calldata zkp, uint size_path, uint size_val) internal view returns(uint[] memory){
    require(zkp[19] == root, "root mismatch");
    require(zkp[size_path + size_val + 10] == path[0], "wrong collection");
    require(zkp[size_path + size_val + 11] == path[1], "wrong doc");
    require(zkp[8] == 1, "value doesn't exist");
    require(path.length <= size_path + size_val, "path too long");
    for(uint i = 9; i < 9 + path.length - 2; i++) require(path[i - 7] == zkp[i], "wrong path");
    uint[] memory value = new uint[](size_val);
    for(uint i = 9 + size_path; i < 9 + size_path + size_val; i++) value[i - (9 + size_path)] = zkp[i];
    return toArr(value);
  }

  function commit (uint[] calldata zkp) public returns (uint) {
    require (zkp[9] == root, "wrong merkle root");
    require(msg.sender == committer, "sender is not committer");
    root = zkp[8];
    verifyRU(zkp);
    return root;
  }

  function verifyRU(uint[] calldata zkp) public view returns (bool) {
    return _verifyRU(zkp);
  }

}
