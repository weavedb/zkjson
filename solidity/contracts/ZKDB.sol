pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

interface VerifierDB {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[204] calldata _pubSignals) view external returns (bool);

}

interface VerifierRU {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[1] calldata _pubSignals) view external returns (bool);

}

contract ZKDB {
  address public verifierRU;
  address public verifierDB;
  address public comitter;
  uint public root;
  
  constructor (address _verifierRU, address _verifierDB, address _comitter){
    verifierRU = _verifierRU;
    verifierDB = _verifierDB;
    comitter = _comitter;
    
  }
  
  function commit (uint[9] calldata zkp) public returns (uint) {
    require(msg.sender == comitter, "sender is not comitter");
    root = zkp[8];
    verifyRU(zkp);
    return root;
    
  }

  function verifyRU(uint[9] calldata zkp) public view returns (bool) {
    uint[2] memory _pA;
    uint[2][2] memory _pB;
    uint[2] memory _pC;
    uint[1] memory sigs;
    for(uint i = 0; i < 2; i++) _pA[i] = zkp[i];
    for(uint i = 2; i < 4; i++) _pB[0][i - 2] = zkp[i];
    for(uint i = 4; i < 6; i++) _pB[1][i - 4] = zkp[i];
    for(uint i = 6; i < 8; i++) _pC[i - 6] = zkp[i];
    for(uint i = 8; i < 9; i++) sigs[i - 8] = zkp[i];
    require(VerifierRU(verifierRU).verifyProof(_pA, _pB, _pC, sigs), "invalid proof");
    return true;
  }

  function verifyDB(uint[212] calldata zkp) public view returns (bool) {
    uint[2] memory _pA;
    uint[2][2] memory _pB;
    uint[2] memory _pC;
    uint[204] memory sigs;
    for(uint i = 0; i < 2; i++) _pA[i] = zkp[i];
    for(uint i = 2; i < 4; i++) _pB[0][i - 2] = zkp[i];
    for(uint i = 4; i < 6; i++) _pB[1][i - 4] = zkp[i];
    for(uint i = 6; i < 8; i++) _pC[i - 6] = zkp[i];
    for(uint i = 8; i < 212; i++) sigs[i - 8] = zkp[i];
    require(VerifierDB(verifierDB).verifyProof(_pA, _pB, _pC, sigs), "invalid proof");
    return true;
  }
  
  function query (uint collection, uint doc, uint[100] memory path, uint[212] calldata zkp) public view returns (int) {
    require(zkp[209] == root, "root mismatch");
    require(zkp[8] == 1, "value doesn't exist");
    require(zkp[210] == collection, "wrong collection");
    require(zkp[211] == doc, "wrong doc");
    for(uint i = 9; i < 109; i++) require(path[i - 9] == zkp[i], "wrong path");
    
    uint[100] memory value;
    for(uint i = 109; i < 209; i++) value[i - 109] = zkp[i];
    require(value[0] == 2, "not int");

    verifyDB(zkp);
    
    return int(value[2]) * (value[1] == 1 ? int(1) : int(-1));
  }
}
