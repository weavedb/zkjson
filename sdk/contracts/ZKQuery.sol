// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract ZKQuery {

  function getPath(uint i, uint[] memory _json) private pure returns(uint[] memory, uint){
    uint[] memory _path;
    assembly {
      let json := add(_json, 0x20)
      let len := mload(add(json, mul(i, 0x20)))
      i := add(i, 1)
      _path := msize()
      mstore(_path, sub(mload(_json), i))
      let _path0 := add(_path, 0x20)
      mstore(_path0, len)
      let pi := 0x20
      for { let i2 := 0 } lt(i2, len) { i2 := add(i2, 1) } {
	let plen := mload(add(json, mul(i, 0x20)))
        mstore(add(_path0, pi), plen)
	pi := add(pi, 0x20)
	i := add(i, 1)
	let plen2 := 1
	if iszero(plen) {
          if iszero(mload(add(json, mul(i, 0x20)))){
	    plen2 := 2
          }
        }
	for { let i3 := 0 } lt(i3, plen2) { i3 := add(i3, 1) } {
	  mstore(add(_path0, pi), mload(add(json, mul(i, 0x20))))
	  pi := add(pi, 0x20)
	  i := add(i, 1)
	}
      }
      mstore(_path, div(pi, 0x20))
      mstore(0x40, add(_path, add(0x20, pi)))
    }
    return (_path, i);
  }

  function _getVal(uint i, uint[] memory _json) private pure returns(uint[] memory, uint){
    uint[] memory _val;
    assembly {
      let json := add(_json, 0x20)
      _val := msize()
      mstore(_val, sub(mload(_json), i))
      let _val0 := add(_val, 0x20)
      let _type := mload(add(json, mul(i, 0x20)))
      i := add(i, 1)
      let vlen := 0x20
      mstore(_val0, _type)
      let len := 0	
      if eq(_type, 1) {
	len := 1
      }
      if eq(_type, 2) {
	len := 3
      }
      if eq(_type, 3) {
	len := add(mload(add(json, mul(i, 0x20))), 1)
      }
      for { let i2 := 0 } lt(i2, len) { i2 := add(i2, 1) } {
	mstore(add(_val0, vlen), mload(add(json, mul(i, 0x20))))	  
	vlen := add(vlen, 0x20)
        i := add(i, 1)
      }
      mstore(_val, div(vlen, 0x20))
      mstore(0x40, add(_val, add(0x20, vlen)))
    }
    return (_val, i);
  }
  
  function getVal(uint[] memory path, uint[] memory _json) private pure returns(uint[] memory){
    require (_json[0] == 4, "not raw value");
    uint[] memory path2 = toArr(path);
    uint i = 1;
    while(i < _json.length){
      (uint[] memory _path, uint i2) = getPath(i, _json);
      (uint[] memory _val2, uint i3) = _getVal(i2, _json);
      i = i3;
      uint path_match = 1;
      if(_path.length != path2.length){
	path_match = 0;
      }else{
	for(uint i4 = 0; i4 < path2.length; i4++){
	  if(_path[i4] != path2[i4]) path_match = 0;
	}
      }
      if(path_match == 1) return _val2;
    }
    require(false, "value not found");
  }
  
  function toArr(uint[] memory json) internal pure returns(uint[] memory){
    uint[]  memory _json;
    assembly {
      let ji := 0x0
      let prev := 0
      let start := add(json, 0x20)
      _json := msize()
      mstore(_json, mload(json))
      let _json0 := add(_json, 0x20)
      for { let i := 0 } lt(i, mload(json)) { i := add(i, 1) } {
	let v := mload(add(start, mul(i, 0x20)))
	if gt(v,0) {  
	  let p := 0
	  let x := v
  	  let on := 0 // 0 = first, 1 = off, 2 = on, 3 = is9, 4 = to set zero, 5 = zero
	  let cur := 0
	  let len := 0
	  let num := 0
          for { } gt(v, 0) { } {
	    v := div(v, 10)
            p := add(p, 1)
          }
	  for { } gt(p, 0) { } {
	    let n := div(x, exp(10, sub(p, 1)))
	    let _on := on
	    if iszero(_on){
	      on := 1
	    }
	    if and(eq(_on, 1), iszero(n)) {
	        on := 4
	    }
    	    if eq(_on, 4) {
	        on := 5
		len := n
	    }	
	    if and(eq(_on, 1), gt(n, 0)) {
	      if eq(n, 9) {
		len := 8
	        on := 3       
	      }
	      if and(iszero(iszero(n)), iszero(eq(n,9))) {
	        on := 2
		len := n  
	      }
              cur := 0
	    }
	    if gt(_on, 1) {
	      if eq(_on, 5){
		mstore(add(_json0, ji), n)
		len := sub(len, 1)
		ji := add(ji, 0x20)
		if iszero(len) {
		  cur := 0
		  on := 1
		  len := 0
		  num := 0
		}
	      }
	      if iszero(eq(_on, 5)){
                num := add(num, mul(n, exp(10, sub(sub(len, cur), 1))))
                cur := add(cur, 1)
                if eq(cur, len) {
                  prev := mul(prev, exp(10, len))
                  if eq(_on, 3) {
                    prev := add(prev, num)
                  }
	          if iszero(eq(_on, 3)) {
                    num := add(num, prev)
                    prev := 0
		    mstore(add(_json0, ji), num)
                    ji := add(ji, 0x20)
                  }
                  cur := 0
                  on := 1
                  len := 0
                  num := 0
                }
	      }
            }
	    x := sub(x, mul(exp(10, sub(p, 1)), n))
	    p := sub(p, 1)
	  }
	}
      }
      mstore(_json, div(ji, 0x20))
      mstore(0x40, add(_json, add(0x20, ji)))
    }
    return _json;
  }

  function _toString(uint8[] memory charCodes) private pure returns (string memory) {
    bytes memory stringBytes = new bytes(charCodes.length);
    for (uint i = 0; i < charCodes.length; i++) stringBytes[i] = bytes1(charCodes[i]);
    return string(stringBytes);
  }

  function _qInt (uint[] memory value) internal pure returns (int) {
    require(value[0] == 2 && value[2] == 0, "not int");
    return int(value[3]) * (value[1] == 1 ? int(1) : int(-1));
  }
  
  function _qFloat (uint[] memory value) internal pure returns (uint[3] memory) {
    require(value[0] == 2 && value[2] != 0, "not float");
    uint[3] memory float;
    float[0] = value[1];
    float[1] = value[2];
    float[2] = value[3];
    return float;
  }

  function _qRaw (uint[] memory value) internal pure returns (uint[] memory) {
    require(value[0] == 4, "not object or array");
    return value;
  }
  
  function _qString (uint[] memory value) internal pure returns (string memory) {
    require(value[0] == 3, "not string");
    uint8[] memory charCodes = new uint8[](value[1]);
    for(uint i = 0; i < value[1];i++) charCodes[i] = uint8(value[i+2]);
    string memory str = _toString(charCodes);
    return str;
  }

  function _qBool (uint[] memory value) internal pure returns (bool) {
    require(value[0] == 1, "not bool");
    return value[1] == 1 ? true : false;
  }
  
  function _qNull (uint[] memory value) internal pure returns (bool) {
    require(value[0] == 0, "not null");
    return true;
  }

  function _qCond (uint[] memory value, uint[] memory cond) internal pure returns (bool) {
    uint[] memory _cond = toArr(cond);
    require(value.length == _cond.length, "wrong query");
    for(uint i = 0; i < value.length; i++)  require(_cond[i] == value[i], "wrong query");
    return true;
  }
  
  function getInt (uint[] memory path, uint[] memory raw) internal pure returns (int) {
    uint[] memory value = getVal(path, raw);
    return _qInt(value);
  }

  function getString (uint[] memory path, uint[] memory raw) internal pure returns (string memory) {
    uint[] memory value = getVal(path, raw);
    _qString(value);
  }

  function getBool (uint[] memory path, uint[] memory raw) internal pure returns (bool) {
    uint[] memory value = getVal(path, raw);
    _qBool(value);
  }

  function getNull (uint[] memory path, uint[] memory raw) internal pure returns (bool) {
    uint[] memory value = getVal(path, raw);
    _qNull(value);
  }
  
  function verify(uint[] memory zkp, bytes4 selector, address addr) internal view returns (bool) {
    uint size;
    assembly {
      size := extcodesize(addr)
    }
    require(size > 0, "contract doesn't exist");
    bool valid;
    assembly{
      let callData := mload(0x40)
      let zlen := mload(zkp)
      let clen := add(0x4, mul(0x20, zlen))
      mstore(callData, clen)
      mstore(add(callData, 0x20), selector)
      for { let i := 1 } lt(i, add(1, zlen)) { i := add(i, 1) } {
	mstore(add(callData, add(0x4, mul(i, 0x20))), mload(add(zkp, mul(i, 0x20))))
      }
      let success := staticcall(
        gas(),            
        addr,
	add(callData, 0x20), 
	clen,   
	callData,         
	0x20          
      )
      if iszero(success) {
        revert(0, 0)
      }
      valid := mload(callData)
    }
    require(valid, "invalid proof");
    return true;
  }
}
