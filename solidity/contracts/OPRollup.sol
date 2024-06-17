// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "./ZKRollup.sol";


contract OPRollup is ZKRollup {
  
  function commitRoot (uint _root) public returns (uint) {
    require(msg.sender == committer, "sender is not committer");
    root = _root;
    return root;
  }
}
