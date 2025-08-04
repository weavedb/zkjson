// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "./ZKQuery.sol";

contract NORollup is ZKQuery {
  function _validateQuery(uint[] memory zkp, uint size_path, uint size_val) internal view returns(uint[] memory){
    require(zkp[8] == 1, "value doesn't exist");
    uint[] memory value = new uint[](size_val);
    for(uint i = 9 + size_path; i < 9 + size_path + size_val; i++) value[i - (9 + size_path)] = zkp[i];
    return toArr(value);
  }
}
