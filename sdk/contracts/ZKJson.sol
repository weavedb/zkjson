// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "hardhat/console.sol";
import "./ZKQuery.sol";

contract ZKJson is ZKQuery{

  function _validateQueryJSON(uint[] memory path, uint[] calldata zkp, uint size) public pure returns(uint[] memory){
    require(zkp[8] == 1, "value doesn't exist");
    for(uint i = 10; i < 15; i++) require(path[i - 10] == zkp[i], "wrong path");
    uint[] memory value = new uint[](size);
    for(uint i = 15; i < 20; i++) value[i - 15] = zkp[i];
    return toArr(value);
  }

}
