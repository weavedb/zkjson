// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "./ZKQuery.sol";

contract ZKJson is ZKQuery{
  address public verifierJSON;

  function _validateQueryJSON(uint[] memory path, uint[] memory zkp, uint size_path, uint size_val) internal pure returns(uint[] memory){
    require(zkp[8] == 1, "value doesn't exist");
    for(uint i = 10; i < 10 + size_path; i++){
      require((path.length <= i - 10 && zkp[i] == 0) || path[i - 10] == zkp[i], "wrong path");
    }
    uint[] memory value = new uint[](size_val);
    for(uint i = 10 + size_path; i < 10 + size_path + size_val; i++){
      value[i - (10 + size_val)] = zkp[i];
    }
    return toArr(value);
  }

}
