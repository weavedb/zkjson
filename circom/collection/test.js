const chai = require("chai")
const { join } = require("path")
const wasm_tester = require("circom_tester").wasm
const { Collection } = require("../../sdk")

const _json = { a: 5 }
const _path = "a"
const _val = _json[_path]

describe("JSON circuit", function () {
  let circuit
  this.timeout(1000000000)

  before(async () => {
    circuit = await wasm_tester(join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const col = new Collection({ size: 5, size_json: 256, level: 100 })
    const id = "docA"
    await col.init()
    await col.insert("docB", { b: 2 })
    await col.insert("docC", { c: 3 })
    await col.insert("docA", { c: 4 })
    await col.update(id, _json)
    const inputs = await col.getInputs({
      json: _json,
      path: _path,
      val: _val,
      id,
    })
    const w = await circuit.calculateWitness(inputs, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { exist: 1 })
  })
})
