## zkJSON SDK

### Install

```bash
yarn add zkjson
```

### Encoder / Decoder

Encode / Decode JSON

```javascript
const { encode, decode, toSignal, fromSignal } = require("zkjson")

const json = { a : 1 }
const encoded = encode(json) // [ 1, 1, 97, 2, 1, 0,  1 ]
const signal = toSignal(encoded) // [ '111129712111011' ]
const encoded2 = fromSignal(signal) // [ 1, 1, 97, 2, 1, 0, 1 ]
const decoded = decode(encoded2) // { a : 1 }
```

Encode / Decode paths

```javascript
const { toSignal, fromSignal, encodePath, decodePath, path } = require("zkjson")

const _path = "a"
const encodedPath = encodePath(_path) // [ 1, 1, 97 ]
const signalPath = toSignal(encodedPath) // [ "1111297" ]
const encodedPath2 = fromSignal(signalPath) // [ 1, 1, 97 ]
const decodedPath = decodePath(encodedPath) // "a"

const signalPath2 = path(_path) // [ "1111297" ]
```

Encode / Decode values

```javascript
const { toSignal, fromSignal, encodeVal, decodeVal, val } = require("zkjson")

const _val = 1
const encodedVal = encodeVal(_val) // [ 2, 1, 0, 1 ]
const signalVal = toSignal(encodedVal) // [ "12111011" ]
const encodedVal2 = fromSignal(signalVal) // [ 2, 1, 0, 1 ]
const decodedVal = decodeVal(encodedVal) // 1

const signalVal2 = val(_val) // [ "12111011" ]
```

Encode / Decode conditional queries

```javascript
const { toSignal, fromSignal, encodeQuery, decodeQuery, query } = require("zkjson")

const _query = [ "$gt", 1 ]
const encodedQuery = encodeQuery(_query) // [ 12, 2, 1, 0, 1 ]
const signalQuery = toSignal(encodedQuery) // [ "21212111011" ]
const encodedQuery2 = fromSignal(signalQuery) // [ 12, 2, 1, 0, 1 ]
const decodedQuery = decodeQuery(encodedQuery) // [ "$gt", 1 ]

const signalQuery2 = query(_query) // [ "21212111011" ]
```

### Document ID <> Index Conversion

```javascript
 const { toIndex, fromIndexs } = require("zkjson")
 
 const index = toIndex("zkJSON") // 1513609181413
 const str = fromIndex(index) // "zkJSON"
```

### Doc

```javascript
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { path, Doc } = require("../../sdk")
const { resolve } = require("path")
const { expect } = require("chai")

async function deploy() {
  const Verifier = await ethers.getContractFactory("Groth16VerifierJSON")
  const verifier = await Verifier.deploy()
  const MyApp = await ethers.getContractFactory("SimpleJSON")
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

  it("should verify JSON", async function () {
    const doc = new Doc({
      wasm: resolve(
        __dirname,
        "../../circom/build/circuits/json/index_js/index.wasm"
      ),
      zkey: resolve(
        __dirname,
        "../../circom/build/circuits/json/index_0001.zkey"
      ),
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
    expect((await myapp.qInt(path("num"), zkp)).toNumber()).to.eql(1)

    // query string
    const zkp2 = await doc.genProof({ json, path: "str" })
    expect(await myapp.qString(path("str"), zkp2)).to.eql("string")

    // query bool
    const zkp3 = await doc.genProof({ json, path: "bool" })
    expect(await myapp.qBool(path("bool"), zkp3)).to.eql(true)

    // query null
    const zkp4 = await doc.genProof({ json, path: "null" })
    expect(await myapp.qNull(path("null"), zkp4)).to.eql(true)

    // query float
    const zkp5 = await doc.genProof({ json, path: "float" })
    expect(
      (await myapp.qFloat(path("float"), zkp5)).map(f => f.toNumber())
    ).to.eql([1, 2, 123])

    // query array and get number
    const zkp6 = await doc.genProof({ json, path: "array" })
    expect(
      (await myapp.qCustom(path("array"), path("[1]"), zkp6)).toNumber()
    ).to.eql(2)
	
    // conditional operator
    const zkp7 = await doc.genProof({ json, path: "num", query: ["$gt", 0] })
    expect(await myapp.qCond(path("num"), zkp7.slice(15, 21), zkp7)).to.eql(
      true
    )

  })
})
```

### DB

```javascript
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { toIndex, path, DB } = require("../../sdk")
const { resolve } = require("path")
const { expect } = require("chai")

async function deploy() {
  const [committer] = await ethers.getSigners()
  const VerifierRU = await ethers.getContractFactory("Groth16VerifierRU")
  const verifierRU = await VerifierRU.deploy()
  const VerifierDB = await ethers.getContractFactory("Groth16VerifierDB")
  const verifierDB = await VerifierDB.deploy()

  const MyRU = await ethers.getContractFactory("SimpleRU")
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
        "../../circom/build/circuits/rollup/index_js/index.wasm"
      ),
      zkeyRU: resolve(
        __dirname,
        "../../circom/build/circuits/rollup/index_0001.zkey"
      ),
      wasm: resolve(
        __dirname,
        "../../circom/build/circuits/db/index_js/index.wasm"
      ),
      zkey: resolve(
        __dirname,
        "../../circom/build/circuits/db/index_0001.zkey"
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
