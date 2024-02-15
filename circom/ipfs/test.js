const { expect } = require("chai")
const { push, arr, toArray } = require("../../sdk/uint")
const { pad, path, val } = require("../../sdk/encoder")
const chai = require("chai")
const { join } = require("path")
const wasm_tester = require("circom_tester").wasm
const crypto = require("crypto")
const { parse } = require("../../sdk/parse")

function bitArray2buffer(a) {
  const len = Math.floor((a.length - 1) / 8) + 1
  const b = new Buffer.alloc(len)

  for (let i = 0; i < a.length; i++) {
    const p = Math.floor(i / 8)
    b[p] = b[p] | (Number(a[i]) << (7 - (i % 8)))
  }
  return b
}

describe("JSON circuit", function () {
  let circuit
  this.timeout(0)

  before(async () => {
    circuit = await wasm_tester(join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const json = { hello: "world" }
    const str = new TextEncoder().encode(JSON.stringify(json))
    let encoded = arr(256)
    for (let v of Array.from(str)) encoded = push(encoded, 256, 9, v)
    const enc = parse(encoded, 256)
    const _path = pad(path("hello"), 5)
    const _val = pad(path("world"), 5)
    const w = await circuit.calculateWitness(
      { encoded: encoded, path: _path, val: _val },
      true,
    )
    /*const arrOut = w.slice(1, 257)
    const bitArray = arrOut.map(n => (n.toString() === "0" ? 0 : 1))
    const hash = bitArray2buffer(arrOut).toString("hex")*/
    const hash0 = crypto.createHash("sha256").update(str).digest("hex")
    //expect(hash0).to.eql(hash)
    await circuit.checkConstraints(w)
    return
  })
})
