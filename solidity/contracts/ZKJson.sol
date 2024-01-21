// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "hardhat/console.sol";

contract ZKJson {

  function digits (uint x) private pure returns(uint) {
    uint p = 0;
    while(x > 0){
        x /= 10;
        p++;
    }
    return p;
  }

  function getValLen(uint[] memory path, uint[] memory _json) private pure returns(uint, uint){
    require (_json[0] == 4, "not raw value");
    uint i = 1;
    uint start;
    uint[] memory path2 = toArr(path);
    uint vallen;
    while(i < _json.length){
      start = i;
      uint pathlen = getPathLen(i, _json);
      uint[] memory _path = new uint[](pathlen);
      uint len = _json[i];
      i++;
      _path[0] = len;
      uint pi = 1;
      for(uint i2=0;i2 < len; i2++){
	uint plen = _json[i];
	_path[pi] = plen;
	pi++;
	i++;
	uint plen2 = plen;
	if(plen == 0){
	  plen2 = _json[i] == 0 ? 2 : 1;
	}
	for(uint i3 = 0; i3 < plen2; i3++){
	  _path[pi] = _json[i];
	  pi++;
	  i++;
	}
      }
      uint _type = _json[i];
      i++;
      uint vlen = 1;
      if(_type == 1){
	vlen++;
	i++;
      }else if (_type == 2){
	vlen += 3;
	i += 3;
      }else if(_type == 3){
	uint slen = _json[i];
	vlen += slen + 1;
	i += slen + 1;
      }
      uint path_match = 1;
      if(pathlen != path2.length){
	path_match = 0;
      }else{
	for(uint i4 = 0; i4 < path2.length; i4++){
	  if(_path[i4] != path2[i4]) path_match = 0;
	}
      }
      if(path_match == 1){
	vallen = vlen;
	break;
      }
    }
    return (vallen, start);
  }
  
  function getPathLen(uint i, uint[] memory _json) private pure returns(uint){
    uint len = _json[i];
    i++;
    uint pi = 1;
    for(uint i2=0;i2 < len; i2++){
      uint plen = _json[i];
      pi++;
      i++;
      uint plen2 = plen;
      if(plen == 0) plen2 = _json[i] == 0 ? 2 : 1;
      pi += plen2;
      i += plen2;
    }
    return pi;
  }
  
  function getVal(uint[] memory path, uint[] memory _json) private pure returns(uint[] memory){
    require (_json[0] == 4, "not raw value");
    (uint vallen, uint i) = getValLen(path, _json);
    uint[] memory val = new uint[](vallen);
    uint[] memory path2 = toArr(path);
    while(i < _json.length){
      uint pathlen = getPathLen(i, _json);
      uint[] memory _path = new uint[](pathlen);
      uint len = _json[i];
      i++;
      _path[0] = len;
      uint pi = 1;
      for(uint i2=0;i2 < len; i2++){
	uint plen = _json[i];
	_path[pi] = plen;
	pi++;
	i++;
	uint plen2 = plen;
	if(plen == 0){
	  plen2 = _json[i] == 0 ? 2 : 1;
	}
	for(uint i3 = 0; i3 < plen2; i3++){
	  _path[pi] = _json[i];
	  pi++;
	  i++;
	}
      }

      uint _type = _json[i];
      i++;
      uint[] memory _val = new uint[](vallen);
      _val[0] = _type;
      if(_type == 1){
	_val[1] = _json[i];
	i++;
      }else if (_type == 2){
	_val[1] = _json[i];
	i++;
	_val[2] = _json[i];
	i++;
	_val[3] = _json[i];
	i++;
      }else if(_type == 3){
	uint slen = _json[i];
	_val[1] = slen;
	i++;
	for(uint i3 = 0;i3 < slen; i3++){
	  _val[i3 + 2] = _json[i];
	  i++;
	}
      }
      uint path_match = 1;
      if(pathlen != path2.length){
	path_match = 0;
      }else{
	for(uint i4 = 0; i4 < path2.length; i4++){
	  if(_path[i4] != path2[i4]) path_match = 0;
	}
      }
      if(path_match == 1){
	val = _val;
	break;
      }
    }
    return val;
  }
  
  function getLen(uint[] memory json) private pure returns(uint, uint){
    uint ji = 0;
    uint prev = 0;
    uint jlen = 0;
    for(uint j = 0; j < json.length; j++){
      if(json[j] > 0){
	jlen = j + 1;
	uint p = digits(json[j]);
	uint x = json[j];
	uint on = 0;
	uint cur = 0;
	uint len = 0;
	uint num = 0;
	uint is9 = 0;
	while(p > 0){
	  uint n = x / 10 ** (p - 1);
	  if(on == 0 && n > 0){
	    on = 1;
	    if(n == 9){
	      len = 8;
	      is9 = 0;
	    }else{
	      len = n;
	    }
	    cur = 0;
	  }else if(on == 1){
	    num += n * 10 ** (len - cur - 1);
	    cur++;
	    if(cur == len){
	      prev *= 10 ** len;
	      if(is9 == 1){
		prev += num;
	      }else{
		num += prev;
		prev = 0;
		ji++;
	      }
	      cur = 0;
	      on = 0;
	      len = 0;
	      num = 0;
	      is9 = 0;
	    }
	  }
	  x -= 10 ** (p - 1) * n;
	  p--;
	}
      }
    }
    return (ji, jlen);
  }
  
  function toArr(uint[] memory json) internal pure returns(uint[] memory){
    (uint _len, uint _jlen) = getLen(json);
    uint[]  memory _json = new uint[](_len);
    uint ji = 0;
    uint prev = 0;
    for(uint j = 0; j < _jlen; j++){
      uint p = digits(json[j]);
      uint x = json[j];
      uint on = 0;
      uint cur = 0;
      uint len = 0;
      uint num = 0;
      uint is9 = 0;
      while(p > 0){
	uint n = x / 10 ** (p - 1);
	if(on == 0 && n > 0){
	  on = 1;
	  if(n == 9){
	    len = 8;
	    is9 = 0;
	  }else{
	    len = n;
	  }
	  cur = 0;
	}else if(on == 1){
	  num += n * 10 ** (len - cur - 1);
	  cur++;
	  if(cur == len){
	    prev *= 10 ** len;
	    if(is9 == 1){
	      prev += num;
	    }else{
	      num += prev;
	      prev = 0;
	      _json[ji] = num;
	      ji++;
	    }
	    cur = 0;
	    on = 0;
	    len = 0;
	    num = 0;
	    is9 = 0;
	  }
	}
	x -= 10 ** (p - 1) * n;
	p--;
      }
    }
    return _json;
  }

  function getInt (uint[] memory path, uint[] memory raw) public pure returns (int) {
    uint[] memory value = getVal(path, raw);
    require(value[0] == 2 && value[2] == 0, "not int");
    return int(value[3]) * (value[1] == 1 ? int(1) : int(-1));
  }

  function getString (uint[] memory path, uint[] memory raw) public pure returns (string memory) {
    uint[] memory value = getVal(path, raw);
    require(value[0] == 3, "not string");
    uint8[] memory charCodes = new uint8[](value[1]);
    for(uint i = 0; i < value[1];i++) charCodes[i] = uint8(value[i+2]);
    string memory str = _toString(charCodes);
    return str;
  }

  function getBool (uint[] memory path, uint[] memory raw) public pure returns (bool) {
    uint[] memory value = getVal(path, raw);
    require(value[0] == 1, "not bool");
    return value[1] == 1 ? true : false;
  }

  function getNull (uint[] memory path, uint[] memory raw) public pure returns (bool) {
    uint[] memory value = getVal(path, raw);
    require(value[0] == 0, "not null");
    return true;
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
    require(value[0] == 2 && value[2] == 1, "not float");
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

  function _parseZKP(uint[] calldata zkp) internal pure returns (uint[2] memory, uint[2][2] memory, uint[2] memory, uint[] memory) {
    uint[2] memory _pA;
    uint[2][2] memory _pB;
    uint[2] memory _pC;
    uint[] memory sigs = new uint[](zkp.length - 8);
    for(uint i = 0; i < 2; i++) _pA[i] = zkp[i];
    for(uint i = 2; i < 4; i++) _pB[0][i - 2] = zkp[i];
    for(uint i = 4; i < 6; i++) _pB[1][i - 4] = zkp[i];
    for(uint i = 6; i < 8; i++) _pC[i - 6] = zkp[i];
    for(uint i = 8; i < zkp.length; i++) sigs[i - 8] = zkp[i];
    return (_pA, _pB, _pC, sigs);
  }

  function _validateQueryJSON(uint[] memory path, uint[] calldata zkp, uint size) public pure returns(uint[] memory){
    require(zkp[8] == 1, "value doesn't exist");
    for(uint i = 10; i < 15; i++) require(path[i - 10] == zkp[i], "wrong path");
    uint[] memory value = new uint[](size);
    for(uint i = 15; i < 20; i++) value[i - 15] = zkp[i];
    return toArr(value);
  }
  
}
