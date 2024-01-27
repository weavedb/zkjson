// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "../ZKJson.sol";

interface VerifierJSON {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[12] calldata _pubSignals) view external returns (bool);

}

contract ZKArweave is ZKJson {
  address public verifier;
  address public validator;
  uint constant SIZE_PATH = 5;
  uint constant SIZE_VAL = 5;
  
  constructor (address _verifier, address _validator){
    verifier = _verifier;
    validator = _validator;
  }
  
  function validateQuery(string memory txid, uint[] memory path, uint[] memory zkp, bytes memory sig) public view returns(uint[] memory){
    verify(zkp, VerifierJSON.verifyProof.selector, verifier);
    verifyMessage(txid, zkp[9], sig);
    return _validateQueryJSON(path, zkp, SIZE_PATH, SIZE_VAL);
  }

  function qInt (string memory txid, uint[] memory path, uint[] memory zkp, bytes memory sig) public view returns (int) {
    uint[] memory value = validateQuery(txid, path, zkp, sig);
    return _qInt(value);
  }

  function qFloat (string memory txid, uint[] memory path, uint[] memory zkp, bytes memory sig) public view returns (uint[3] memory) {
    uint[] memory value = validateQuery(txid, path, zkp, sig);
    return _qFloat(value);
  }

  function qRaw (string memory txid, uint[] memory path, uint[] memory zkp, bytes memory sig) public view returns (uint[] memory) {
    uint[] memory value = validateQuery(txid, path, zkp, sig);
    return _qRaw(value);
  }
  
  function qString (string memory txid, uint[] memory path, uint[] memory zkp, bytes memory sig) public view returns (string memory) {
    uint[] memory value = validateQuery(txid, path, zkp, sig);
    return _qString(value);
  }

  function qBool (string memory txid, uint[] memory path, uint[] memory zkp, bytes memory sig) public view returns (bool) {
    uint[] memory value = validateQuery(txid, path, zkp, sig);
    return _qBool(value);
  }
  
  function qNull (string memory txid, uint[] memory path, uint[] memory zkp, bytes memory sig) public view returns (bool) {
    uint[] memory value = validateQuery(txid, path, zkp, sig);
    return _qNull(value);
  }

  function getMessageHash(string memory txid, uint hash) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(txid, hash));
  }
  
  function getEthSignedMessageHash( bytes32 _messageHash ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
  }

  function verifyMessage(string memory txid, uint _message, bytes memory signature) public view returns (bool) {
    bytes32 messageHash = getMessageHash(txid,  _message);
    bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
    return recoverSigner(ethSignedMessageHash, signature) == validator;
  }
  
  function recoverSigner(
			 bytes32 _ethSignedMessageHash,
			 bytes memory _signature
			 ) private pure returns (address) {
    (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
    return ecrecover(_ethSignedMessageHash, v, r, s);
  }

  function splitSignature(bytes memory sig) private pure returns (bytes32 r, bytes32 s, uint8 v) {
    require(sig.length == 65, "invalid signature length");
    assembly {
    r := mload(add(sig, 32))
	s := mload(add(sig, 64))
	v := byte(0, mload(add(sig, 96)))
	}
  }
}
