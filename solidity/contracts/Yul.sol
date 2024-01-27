// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "hardhat/console.sol";

contract Yul {
  function test() public pure returns(uint){
    uint ans;
    uint b;
    assembly {
      let one := 2
	let two := 2
	for {let i := 0} lt( i, 15 ) {i := add(i,1)}
      {
      b := i
      two := i
	}
      	ans := add(one, two)

    }
    console.log(b);
    return ans;
  }

}
