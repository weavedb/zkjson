// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IZKDB {
  
  function qInt (uint[] memory path, uint[] memory zkp) external view returns (int);
  
  function qString ( uint[] memory path, uint[] memory zkp) external view returns (string memory);
  
}

interface IERC20 {
  function mint (address, uint) external;
}
  
contract ZKBridge {
  address public zkdb;
  address public token;
  mapping(uint => bool) public done;
  constructor (address _zkdb, address _token){
    zkdb = _zkdb;
    token = _token;
  }

  function hexCharToByte(uint8 c) public pure returns (uint8) {
    if (bytes1(c) >= bytes1('0') && bytes1(c) <= bytes1('9')) {
      return c - uint8(bytes1('0'));
    }
    if (bytes1(c) >= bytes1('a') && bytes1(c) <= bytes1('f')) {
      return 10 + c - uint8(bytes1('a'));
    }
    if (bytes1(c) >= bytes1('A') && bytes1(c) <= bytes1('F')) {
      return 10 + c - uint8(bytes1('A'));
    }
    revert("Invalid hex character");
  }

  function toAddr(string memory s) public pure returns (address) {
    bytes memory ss = bytes(s);
    require(ss.length == 42, "Invalid length");
        
    uint256 r = 0;
    for (uint256 i = 2; i < 42; i++) {
      r = r * 16 + hexCharToByte(uint8(ss[i]));
    }

    return address(uint160(r));
  }
  
  function char(bytes1 b) internal pure returns (bytes1 c) {
    if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
    else return bytes1(uint8(b) + 0x57);
  }
  
  function bridge(uint col, uint doc, uint[] memory zkp, uint[] memory zkp2) public returns (address){
    require(done[doc] == false, "already minted");
    done[doc] = true;
    uint[] memory path = new uint[](3);
    path[0] = col;
    path[1] = doc;
    path[2] = 1111231163111;
    uint[] memory path2 = new uint[](3);
    path2[0] = col;
    path2[1] = doc;
    path2[2] = 1111629731093111311731103116;
    string memory str = IZKDB(zkdb).qString(path, zkp);
    address addr = toAddr(str);
    int balance = IZKDB(zkdb).qInt(path2, zkp2);
    IERC20(token).mint(addr, uint(balance));
    return addr;
  }
  
}
