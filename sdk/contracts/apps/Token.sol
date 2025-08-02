// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  constructor() ERC20("Token", "TOKEN") {}
  function mint(address to, uint amount) public {
    _mint(to, amount);
  }
}
