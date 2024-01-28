## Simple zkJSON Tutorial

*zkJSON is still under active development, and neither the circuits nor the contracts have been audited. Please use it for only experimental purposes.*

### Install `zkjson` Package

Make sure you have [Circom](https://docs.circom.io/getting-started/installation/) and [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#installation) installed globally.

```bash
git clone https://github.com/weavedb/zkjson.git
cd zkjson
yarn
```

### Generate Powers of Tau

```bash
yarn ceremony --power 14
```

### Compile Circuit

```bash
yarn compile --power 14 --circuit json
```

### Create Solidity Project with Hardhat

```bash
cd ..
mkdir myapp
cd myapp
npx hardhat init
yarn add zkjson
```

### Copy Verifier Contract

```bash
cp ../zkjson/circom/build/circuit/json/verifier.sol contracts/verifier_json.sol
```

Rename the contract name to `Groth16VerifierJSON` as we will have multiple verifiers with the same name.

Open `myapp/contracts/verifier_json.sol` and rename

```solidity
contract Groth16Verifier {
```

to

```solidity
contract Groth16VerifierJSON {
```

### Write Solidity Contract

`myapp/contracts/MyApp.sol`

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

import "../node_modules/zkjson/contracts/ZKJson.sol";

interface VerifierJSON {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[12] calldata _pubSignals) view external returns (bool);
}

contract MyApp is ZKJSON {
  uint constant SIZE_PATH = 5;
  uint constant SIZE_VAL = 5;
  
  constructor (address _verifierJSON){
    verifierJSON = _verifierJSON;
  }
  
  function validateQuery(uint[] memory path, uint[] memory zkp) private view returns(uint[] memory){
    verify(zkp, VerifierJSON.verifyProof.selector, verifierJSON);
	return _validateQueryRU(path, zkp, SIZE_PATH, SIZE_VAL);    
  }

  function qInt (uint[] memory path, uint[] memory zkp) public view returns (int) {
    uint[] memory value = validateQuery(path, zkp);
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
```

### Write Tests

`myapp/test/MyApp.js`

```javascript
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { Doc, toSignal, encodePath } = require("zkjson")
const { resolve } = require("path")
const { expect } = require("chai")

async function deploy() {
  const Verifier = await ethers.getContractFactory("Groth16VerifierJSON")
  const verifier = await Verifier.deploy()
  const MyApp = await ethers.getContractFactory("MyApp")
  const myapp = await MyApp.deploy(verifier.address)
  return { myapp }
}

describe("MyApp", function () {
  let myapp
  this.timeout(0)

  beforeEach(async () => {
    const dep = await loadFixture(deploy)
    myapp = dep.myapp
  })

  it("should query JSON values", async function () {
    const doc = new Doc({
      wasm: resolve( __dirname, "../../zkjson/circom/build/circuits/json/index_js/index.wasm" ),
      zkey: resolve( __dirname, "../../zkjson/circom/build/circuits/json/index_0001.zkey" ),
    })
	
    const json = {
      num: 1,
      float: 1.23,
      str: "string",
      bool: true,
      null: null,
      array: [1, 2, 3],
    }

    // query number
    const zkp = await doc.genProof({ json, path: "num" })
    expect(
      (await myapp.qInt(toSignal(encodePath("num")), zkp)).toNumber()
    ).to.eql(1)

    // query string
    const zkp2 = await doc.genProof({ json, path: "str" })
    expect(await myapp.qString(toSignal(encodePath("str")), zkp2)).to.eql(
      "string"
    )

    // query bool
    const zkp3 = await doc.genProof({ json, path: "bool" })
    expect(await myapp.qBool(toSignal(encodePath("bool")), zkp3)).to.eql(true)

    // query null
    const zkp4 = await doc.genProof({ json, path: "null" })
    expect(await myapp.qNull(toSignal(encodePath("null")), zkp4)).to.eql(true)

    // query float
    const zkp5 = await doc.genProof({ json, path: "float" })
    expect(
      (await myapp.qFloat(toSignal(encodePath("float")), zkp5)).map(f =>
        f.toNumber()
      )
    ).to.eql([1, 2, 123])
	
    // query array and get number
    const zkp6 = await doc.genProof({ json, path: "array" })
    expect(
      (
        await myapp.qCustom(
          toSignal(encodePath("array")),
          toSignal(encodePath("[1]")),
          zkp6
        )
      ).toNumber()
    ).to.eql(2)
  })
})
```

Then run the tests.

```bash
yarn hardhat test test/MyApp.js
```
