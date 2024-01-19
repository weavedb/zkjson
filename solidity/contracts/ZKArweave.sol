pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

interface VerifierJSON {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[12] calldata _pubSignals) view external returns (bool);

}

contract ZKArweave {
  address public verifier;
  address public validator;
  
  constructor (address _verifier, address _validator){
    verifier = _verifier;
    validator = _validator;
    
  }

  function digits (uint x) public pure returns(uint) {
    uint p = 0;
    while(x > 0){
      x /= 10;
      p++;
    }
    return p;
  }
  
  function getVal(uint[5] memory path, uint[100] memory _json) public pure returns(uint[100] memory){
    require (_json[0] == 4, "not raw value");
    uint i = 1;
    uint[100] memory val;
    uint[100] memory path2 = toArr(5, path);
    while(i < 100){
      uint[100] memory _path;
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
      uint[100] memory _val;
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
      for(uint i4 = 0; i4 < 100; i4++){
	if(_path[i4] != path2[i4]) path_match = 0;
      }
      if(path_match == 1){
	val = _val;
	break;
      }
    }
    return val;
  }
  
  function toArr(uint size_json, uint[5] memory json) public pure returns(uint[100] memory){
    uint[100]  memory _json;
    uint ji = 0;
    uint prev = 0;
    for(uint j = 0; j < size_json; j++){
      if(json[j] > 0){
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
    }
    return _json;
  }
  

  function verify(uint[20] calldata zkp) public view returns (bool) {
    uint[2] memory _pA;
    uint[2][2] memory _pB;
    uint[2] memory _pC;
    uint[12] memory sigs;
    for(uint i = 0; i < 2; i++) _pA[i] = zkp[i];
    for(uint i = 2; i < 4; i++) _pB[0][i - 2] = zkp[i];
    for(uint i = 4; i < 6; i++) _pB[1][i - 4] = zkp[i];
    for(uint i = 6; i < 8; i++) _pC[i - 6] = zkp[i];
    for(uint i = 8; i < 20; i++) sigs[i - 8] = zkp[i];
    require(VerifierJSON(verifier).verifyProof(_pA, _pB, _pC, sigs), "invalid proof");
    return true;
  }

  function validateQuery(string memory txid, uint[5] memory path, uint[20] calldata zkp, bytes memory sig) public view returns(uint[100] memory){
    verifyMessage(txid, zkp[9], sig);
    require(zkp[8] == 1, "value doesn't exist");
    for(uint i = 10; i < 15; i++) require(path[i - 10] == zkp[i], "wrong path");
    uint[5] memory value;
    for(uint i = 15; i < 20; i++) value[i - 15] = zkp[i];
    return toArr(5, value);
  }

  function getInt (uint[5] memory path, uint[100] memory raw) public pure returns (int) {
    uint[100] memory value = getVal(path, raw);
    require(value[0] == 2 && value[2] == 0, "not int");
    return int(value[3]) * (value[1] == 1 ? int(1) : int(-1));
  }

  function getString (uint[5] memory path, uint[100] memory raw) public pure returns (string memory) {
    uint[100] memory value = getVal(path, raw);
    require(value[0] == 3, "not string");
    uint8[] memory charCodes = new uint8[](value[1]);
    for(uint i = 0; i < value[1];i++) charCodes[i] = uint8(value[i+2]);
    string memory str = toString(charCodes);
    return str;
  }

  function getBool (uint[5] memory path, uint[100] memory raw) public pure returns (bool) {
    uint[100] memory value = getVal(path, raw);
    require(value[0] == 1, "not bool");
    return value[1] == 1 ? true : false;
  }

  function getNull (uint[5] memory path, uint[100] memory raw) public pure returns (bool) {
    uint[100] memory value = getVal(path, raw);
    require(value[0] == 0, "not null");
    return true;
  }

  function toString(uint8[] memory charCodes) public pure returns (string memory) {
    bytes memory stringBytes = new bytes(charCodes.length);
    for (uint i = 0; i < charCodes.length; i++) stringBytes[i] = bytes1(charCodes[i]);
    return string(stringBytes);
  }
  
  function qInt (string memory txid, uint collection, uint doc, uint[5] memory path, uint[20] calldata zkp, bytes memory sig) public view returns (int) {
    uint[100] memory value = validateQuery(txid, path, zkp, sig);
    require(value[0] == 2 && value[2] == 0, "not int");
    verify(zkp);
    return int(value[3]) * (value[1] == 1 ? int(1) : int(-1));
  }

  function qFloat (string memory txid, uint[5] memory path, uint[20] calldata zkp, bytes memory sig) public view returns (uint[3] memory) {
    uint[100] memory value = validateQuery(txid, path, zkp, sig);
    require(value[0] == 2 && value[2] == 1, "not float");
    verify(zkp);
    uint[3] memory float;
    float[0] = value[1];
    float[1] = value[2];
    float[2] = value[3];
    return float;
  }

  function qRaw (string memory txid, uint[5] memory path, uint[20] calldata zkp, bytes memory sig) public view returns (uint[100] memory) {
    uint[100] memory value = validateQuery(txid, path, zkp, sig);
    require(value[0] == 4, "not object or array");
    verify(zkp);
    return value;
  }
  
  function qString (string memory txid, uint[5] memory path, uint[20] calldata zkp, bytes memory sig) public view returns (string memory) {
    uint[100] memory value = validateQuery(txid, path, zkp, sig);
    require(value[0] == 3, "not string");
    verify(zkp);
    uint8[] memory charCodes = new uint8[](value[1]);
    for(uint i = 0; i < value[1];i++) charCodes[i] = uint8(value[i+2]);
    string memory str = toString(charCodes);
    return str;
  }

  function qBool (string memory txid, uint[5] memory path, uint[20] calldata zkp, bytes memory sig) public view returns (bool) {
    uint[100] memory value = validateQuery(txid, path, zkp, sig);
    require(value[0] == 1, "not bool");
    verify(zkp);
    return value[1] == 1 ? true : false;
  }
  
  function qNull (string memory txid, uint[5] memory path, uint[20] calldata zkp, bytes memory sig) public view returns (bool) {
    uint[100] memory value = validateQuery(txid, path, zkp, sig);
    require(value[0] == 0, "not null");
    verify(zkp);
    return true;
  }

  function getMessageHash(string memory txid, uint hash) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(txid, hash));
  }
  
  function getEthSignedMessageHash( bytes32 _messageHash ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
  }

  function verifyMessage(string memory txid, uint _message, bytes memory signature) public view returns (bool) {
    bytes32 messageHash = getMessageHash(txid,  _message);
    bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
    address val =recoverSigner(ethSignedMessageHash, signature);
    return recoverSigner(ethSignedMessageHash, signature) == validator;
  }
  
  function recoverSigner(
			 bytes32 _ethSignedMessageHash,
			 bytes memory _signature
			 ) public pure returns (address) {
    (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
    return ecrecover(_ethSignedMessageHash, v, r, s);
  }

  function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
    require(sig.length == 65, "invalid signature length");
    assembly {
    r := mload(add(sig, 32))
	s := mload(add(sig, 64))
	v := byte(0, mload(add(sig, 96)))
	}
  }
}
