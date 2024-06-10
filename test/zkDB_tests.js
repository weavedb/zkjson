const { resolve } = require("path")
const {
  path,
  val,
  toSignal,
  fromSignal,
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
  encodeQuery,
  decodeQuery,
  DB,
} = require("../sdk")
const {
  insert,
  slice,
  unshift,
  shift,
  toArray,
  pop,
  length,
  push,
  next,
  arr,
  last,
  replace,
  get,
  pushArray,
  arrPush,
  arrGet,
  popArray,
  remove,
  bn,
  digits,
} = require("../sdk/uint")
const { parse } = require("../sdk/parse")
const { expect } = require("chai")
const { groth16 } = require("snarkjs")

describe("zkDB-zkJSON", function () {
  this.timeout(0)
  it.only("should generate proofs", async () => {
    const wasm = resolve(
      __dirname,
      "../circom/build/circuits/db/index_js/index.wasm",
    )
    const zkey = resolve(
      __dirname,
      "../circom/build/circuits/db/index_0001.zkey",
    )

    const zkdb = new DB({ wasm, zkey })
    await zkdb.init()
    await zkdb.addCollection()
    await zkdb.insert(0, "Bob", { gamer: "Bob", strikes: 30, place: "New York" })
    const zkp = await zkdb.genProof({
      json: { gamer: "Bob", strikes: 30, place: "New York" },
      col_id: 0,
      path: "gamer",
      id: "Bob",
    })

    await zkdb.addCollection()
    await zkdb.insert(1, "Alice", { name: "Alice" })
    const zkp2 = await zkdb.genProof({
      json: { name: "Alice" },
      col_id: 1,
      path: "name",
      id: "Alice",
    })

    //console.log("zkp1", zkp)
    //console.log("zkp2", zkp2)
  })
  
})
