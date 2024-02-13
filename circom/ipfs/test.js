const snarkjs = require("snarkjs")
const { push, arr } = require("../../sdk/uint")
const chai = require("chai")
const { join } = require("path")
const wasm_tester = require("circom_tester").wasm
const crypto = require("crypto")
const { parse } = require("../../sdk/parse")

describe("JSON circuit", function () {
  let circuit
  this.timeout(1000000000)

  before(async () => {
    circuit = await wasm_tester(join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const j = { hello: "world" }
    const b = new TextEncoder().encode(JSON.stringify(j))
    let json = arr(100)
    for (let v of Array.from(b)) json = push(json, 100, 9, v)
    const enc = parse(json, 100)
    const w = await circuit.calculateWitness({ encoded: json }, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { json: enc })
    return
  })
})
