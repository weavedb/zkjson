// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "./ZKQuery.sol";

interface VerifierRU {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[11] calldata _pubSignals) view external returns (bool);

}

contract OPRollup is ZKQuery {
  address public verifierRU;
  address public committer;
  uint public root;
  
  function _validateQueryRU(uint[] memory path, uint[] memory zkp, uint size_path, uint size_val) internal view returns(uint[] memory){
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

  function commit (uint _root) public returns (uint) {
    require(msg.sender == committer, "sender is not committer");
    root = _root;
    return root;
  }
}
