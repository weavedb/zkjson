const chai = require("chai")
const { join } = require("path")
const wasm_tester = require("circom_tester").wasm
const gen = require("./gen")

describe("JSON circuit", function () {
  let circuit
  this.timeout(0)

  before(async () => {
    circuit = await wasm_tester(join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const { inputs } = await gen({})
    const w = await circuit.calculateWitness(inputs, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { exist: 1 })
  })
})
