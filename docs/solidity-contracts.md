## Solidity Contracts

### ZKQuery

```solidity
interface ZKQuery {
  function toArr(uint[] memory json) internal pure returns (uint[] memory);
  
  function _qNull (uint[] memory path, uint[] calldata zkp) internal pure returns (bool);
  function _qBool (uint[] memory path, uint[] calldata zkp) internal pure returns (bool);
  function _qInt (uint[] memory path, uint[] calldata zkp) internal pure returns (int);
  function _qFloat (uint[] memory path, uint[] calldata zkp) internal pure returns (uint[3] memory);
  function _qString (uint[] memory path, uint[] calldata zkp) internal pure returns (string memory);
  function _qRaw (uint[] memory path, uint[] calldata zkp) internal pure returns (uint[] memory);

  function getNull (uint[] memory path, uint[] memory raw) internal pure returns (bool);
  function getBool (uint[] memory path, uint[] memory raw) internal pure returns (bool);
  function getInt (uint[] memory path, uint[]  memory raw) internal pure returns (int);
  function getFloat (uint[] memory path, uint[] memory raw) internal pure returns (uint[3] memory);
  function getString (uint[] memory path, uint[] memory raw) internal pure returns (string memory);
}
```

### ZKJson

```solidity
interface ZKJSON {
  function _validateQueryJSON(
    uint[] memory path,
	uint[] calldata zkp,
	uint size_path,
	uint size_val
  ) internal pure returns (uint[] memory);
}
```

### ZKRollup

```solidity
interface ZKRollup {
  function _validateQueryRU(
    uint[] memory path,
	uint[] calldata zkp,
	uint size_path,
	uint size_val
  ) internal view returns (uint[] memory);

  function commit (uint[] calldata zkp) public returns (uint);
}
```

### Examples

`ZKJson` and `ZKRollup` inherit `ZKQuery`. You need to either inherit `ZKJson` or `ZKRollup` to build your own ZKDB-enabled contract.

#### Simple zkJSON

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "ZKJson.sol";

interface VerifierJSON {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[12] calldata _pubSignals) view external returns (bool);
}

contract SimpleJSON is ZKJson {
  uint constant SIZE_PATH = 5;
  uint constant SIZE_VAL = 5;
  
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
    return _validateQueryJSON(path, zkp, SIZE_PATH, SIZE_VAL);
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

  function qCustom (uint[] memory path, uint[] memory path2, uint[] calldata zkp) public view returns (int) {
    uint[] memory value = validateQuery(path, zkp);
    return getInt(path2, value);
  }
  
}
```

#### Simple zkRollup

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "ZKRollup.sol";

interface VerifierDB {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[14] calldata _pubSignals) view external returns (bool);
}

contract SimpleRU is ZKRollup {
  uint constant SIZE_PATH = 5;
  uint constant SIZE_VAL = 5;
  address public verifierDB;

  constructor (address _verifierRU, address _verifierDB, address _committer){
    verifierRU = _verifierRU;
    verifierDB = _verifierDB;
    committer = _committer;
  }
  
  function verify(uint[] calldata zkp) private view returns (bool) {
    uint[SIZE_PATH + SIZE_VAL + 4] memory sigs;
    (
       uint[2] memory _pA,
       uint[2][2] memory _pB,
       uint[2] memory _pC,
       uint[] memory _sigs
    ) = _parseZKP(zkp);
    for(uint i = 0; i < sigs.length; i++) sigs[i] = _sigs[i];
    require(VerifierDB(verifierDB).verifyProof(_pA, _pB, _pC, sigs), "invalid proof");
    return true;
  }

  function validateQuery(uint[] memory path, uint[] calldata zkp) private view returns(uint[] memory){
    verify(zkp);
    return _validateQueryRU(path, zkp, SIZE_PATH, SIZE_VAL);    
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
```
