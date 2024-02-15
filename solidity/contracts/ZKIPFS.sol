// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "./ZKQuery.sol";
import "hardhat/console.sol";

contract ZKIPFS is ZKQuery{
  address public verifierIPFS;

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

}
