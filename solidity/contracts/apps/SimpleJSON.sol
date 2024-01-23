// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";
import "../ZKQuery.sol";

interface VerifierJSON {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[12] calldata _pubSignals) view external returns (bool);
}

contract SimpleJSON is ZKQuery {
  uint constant SIZE_PATH = 5;
  uint constant SIZE_VAL = 5;
  address public verifierJSON;
  
  constructor (address _verifierJSON){
    verifierJSON = _verifierJSON;
  }
  
  function verify(uint[] calldata zkp) private view returns (bool) {
    uint[SIZE_PATH + SIZE_VAL + 2] memory sigs;
    (
       uint[2] memory _pA,
       uint[2][2] memory _pB,
       uint[2] memory _pC,
       uint[] memory _sigs
    ) = _parseZKP(zkp);
    for(uint i = 0; i < sigs.length; i++) sigs[i] = _sigs[i];
    
    require(VerifierJSON(verifierJSON).verifyProof(_pA, _pB, _pC, sigs), "invalid proof");
    return true;
  }

  function validateQuery(uint[] memory path, uint[] calldata zkp) private view returns(uint[] memory){
    verify(zkp);
    require(zkp[8] == 1, "value doesn't exist");
    for(uint i = 10; i < 10 + SIZE_PATH; i++){
      require((path.length <= i - 10 && zkp[i] == 0) || path[i - 10] == zkp[i], "wrong path");
    }
    uint[] memory value = new uint[](SIZE_VAL);
    for(uint i = 10 + SIZE_PATH; i < 10 + SIZE_PATH + SIZE_VAL; i++){
      value[i - (10 + SIZE_VAL)] = zkp[i];
    }
    return toArr(value);
  }

  function qInt (uint[] memory path, uint[] calldata zkp) public view returns (int) {
    uint[] memory value = validateQuery(path, zkp);
    return _qInt(value);
  }

  function qFloat (uint[] memory path, uint[] calldata zkp) public view returns (uint[3] memory) {
    uint[] memory value = validateQuery(path, zkp);
    return _qFloat(value);
  }

  function qRaw (uint[] memory path, uint[] calldata zkp) public view returns (uint[] memory) {
    uint[] memory value = validateQuery(path, zkp);
    return _qRaw(value);
  }
  
  function qString (uint[] memory path, uint[] calldata zkp) public view returns (string memory) {
    uint[] memory value = validateQuery(path, zkp);
    return _qString(value);
  }

  function qBool (uint[] memory path, uint[] calldata zkp) public view returns (bool) {
    uint[] memory value = validateQuery(path, zkp);
    return _qBool(value);
  }
  
  function qNull (uint[] memory path, uint[] calldata zkp) public view returns (bool) {
    uint[] memory value = validateQuery(path, zkp);
    return _qNull(value);
  }
}
