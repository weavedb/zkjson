## zkDB Rollup Tutorial

*zkJSON is still under active development, and neither the circuits nor the contracts have been auditted. Please use it for only experimental purposes.*

### Install `zkjson` Package

Make sure you have [Circom](https://docs.circom.io/getting-started/installation/) and [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#installation) installed globally.

```bash
git clone https://github.com/weavedb/zkjson.git
cd zkjson
yarn
```

### Generate Powers of Tau

For the `db` circuit,

```bash
yarn ceremony --power 16
```

For the `rollup` circuit,

```bash
yarn ceremony --power 20
```

*Beware that power 20 takes hours.*

### Compile Circuits

We need to compile 2 circuits.

```bash
yarn compile --power 16 --circuit db
yarn compile --power 20 --circuit rollup
```

### Create Solidity Project with Hardhat

```bash
cd ..
mkdir myrollup
cd myrollup
npx hardhat init
yarn add zkjson
```

### Copy Verifier Contracts

```bash
cp ../zkjson/circom/build/circuit/db/verifier.sol contracts/verifier_db.sol
cp ../zkjson/circom/build/circuit/rollup/verifier.sol contracts/verifier_rollup.sol
```

Rename the contract name to `Groth16VerifierJSON` as we will have multiple verifiers with the same name.

Open `myrollup/contracts/verifier_db.sol` and rename

```solidity
contract Groth16Verifier {
```

to

```solidity
contract Groth16VerifierDB {
```

Then open `myrollup/contracts/verifier_rollup.sol` and rename

```solidity
contract Groth16Verifier {
```

to

```solidity
contract Groth16VerifierRU {
```

### Write Solidity Contract

`myrollup/contracts/MyRollup.sol`

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;
import "../node_modules/zkrjson/contracts/ZKRollup.sol";

interface VerifierDB {
  function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[14] calldata _pubSignals) view external returns (bool);
}

contract MyRollup is ZKRollup {
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

### Write Tests

`myrollup/test/MyRollup.js`

```javascript
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { toIndex, Rollup, path, DB } = require("zkjson")
const { resolve } = require("path")
const { expect } = require("chai")

async function deploy() {
  const [committer] = await ethers.getSigners()
  const VerifierRU = await ethers.getContractFactory("Groth16VerifierRU")
  const verifierRU = await VerifierRU.deploy()
  const VerifierDB = await ethers.getContractFactory("Groth16VerifierDB")
  const verifierDB = await VerifierDB.deploy()

  const MyRU = await ethers.getContractFactory("MyRollup")
  const myru = await MyRU.deploy(
    verifierRU.address,
    verifierDB.address,
    committer.address
  )
  return { myru, committer }
}

describe("MyRollup", function () {
  let myru, committer, db, col_id, ru
  this.timeout(0)

  beforeEach(async () => {
    const dep = await loadFixture(deploy)
    myru = dep.myru
    committer = dep.committer
  })

  it("should verify rollup transactions", async function () {
    db = new DB({
      level: 100,
      size_path: 5,
      size_val: 5,
      size_json: 256,
      size_txs: 10,
      level_col: 8,
      wasmRU: resolve(
        __dirname,
        "../../zkjson/circom/build/circuits/rollup/index_js/index.wasm"
      ),
      zkeyRU: resolve(
        __dirname,
        "../../zkjson/circom/build/circuits/rollup/index_0001.zkey"
      ),
      wasm: resolve(
        __dirname,
        "../../zkjson/circom/build/circuits/db/index_js/index.wasm"
      ),
      zkey: resolve(
        __dirname,
        "../../zkjson/circom/build/circuits/db/index_0001.zkey"
      ),
    })
    await db.init()
    col_id = await db.addCollection()
    const people = [
      { name: "Bob", age: 10 },
      { name: "Alice", age: 20 },
      { name: "Mike", age: 30 },
      { name: "Beth", age: 40 },
    ]
    let txs = people.map(v => {
      return [col_id, v.name, v]
    })
	
	// batch commit queries
    const zkp = await db.genRollupProof(txs)
    await myru.commit(zkp)

    const zkp2 = await db.genProof({
      json: people[0],
      col_id,
      path: "age",
      id: "Bob",
    })

    expect(
      (
        await myru.qInt([col_id, toIndex("Bob"), ...path("age")], zkp2)
      ).toNumber()
    ).to.eql(10)

    const zkp3 = await db.genProof({
      json: people[3],
      col_id,
      path: "name",
      id: "Beth",
    })
    expect(
      await myru.qString([col_id, toIndex("Beth"), ...path("name")], zkp3)
    ).to.eql("Beth")
  })
})
```

Then run the tests.

```bash
yarn hardhat test test/MyApp.js
```
