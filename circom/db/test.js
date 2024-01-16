const chai = require("chai")
const { join } = require("path")
const wasm_tester = require("circom_tester").wasm

const { DB } = require("../../sdk")

const _json = { b: 50, a: 3123432423 }
const _path = "a"
const _val = _json[_path]

const size = 5
const size_json = 16
const level = 40

describe("JSON circuit", function () {
  let circuit
  this.timeout(1000000000)

  before(async () => {
    circuit = await wasm_tester(join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const db = new DB({ size: 5, size_json: 16, level: 40 })
    await db.init()
    await db.addCollection("colA")
    await db.insert("colA", "docA", _json)
    await db.insert("colA", "docB", { b: 2 })
    const inputs = await db.getInputs({
      col_id: "colA",
      id: "docA",
      json: _json,
      path: _path,
      val: _val,
    })
    const w = await circuit.calculateWitness(inputs, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { exist: 1 })
  })
})
