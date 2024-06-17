// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.14;

import "../sdk/contracts/ZKRollup.sol";
import "../sdk/contracts/ZKJson.sol";
import "hardhat/console.sol";



interface VerifierJSON {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[12] calldata _pubSignals) view external returns (bool);
}

contract Json is ZKJson, ZKRollup {
  uint constant SIZE_PATH = 5;
  uint constant SIZE_VAL = 5;
  
  constructor (address _verifierJSON){
    verifierJSON = _verifierJSON;
  }
  
  function validateQuery(uint[] memory path, uint[] memory zkp) private view returns(uint[] memory){
    verify(zkp, VerifierJSON.verifyProof.selector, verifierJSON);
    console.log("verify Done");
	return _validateQueryRU(path, zkp, SIZE_PATH, SIZE_VAL);    
  }

  function qInt (uint[] memory path, uint[] memory zkp) public view returns (int) {
    console.log("1");
    uint[] memory value = validateQuery(path, zkp);
    console.log("2");
    return _qInt(value);
  }

  function qFloat (uint[] memory path, uint[] memory zkp) public view returns (uint[3] memory) {
    uint[] memory value = validateQuery(path, zkp);
    return _qFloat(value);
  }

  function qRaw (uint[] memory path, uint[] memory zkp) public view returns (uint[] memory) {
    uint[] memory value = validateQuery(path, zkp);
    return _qRaw(value);
  }
  
  function qString (uint[] memory path, uint[] memory zkp) public view returns (string memory) {
    uint[] memory value = validateQuery(path, zkp);
    return _qString(value);
  }

  function qBool (uint[] memory path, uint[] memory zkp) public view returns (bool) {
    uint[] memory value = validateQuery(path, zkp);
    return _qBool(value);
  }
  
  function qNull (uint[] memory path, uint[] memory zkp) public view returns (bool) {
    uint[] memory value = validateQuery(path, zkp);
    return _qNull(value);
  }
  
  function qCustom (uint[] memory path, uint[] memory path2, uint[] memory zkp) public view returns (int) {
    uint[] memory value = validateQuery(path, zkp);
    return getInt(path2, value);
  }
}