const chai = require("chai")
const { join } = require("path")
const wasm_tester = require("circom_tester").wasm
const { fromSignal, Doc } = require("../../sdk")

describe("JSON circuit", function () {
  let circuit
  this.timeout(1000000000)

  before(async () => {
    circuit = await wasm_tester(join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const doc = new Doc({ size: 10, size_json: 100 })
    const inputs = await doc.getInputs({
      json: { a: 1.234, b: 5.5, c: [1, 2, [3, 4, { a: 3 }]] },
      path: "c[2][2].a",
      val: 3,
    })
    const w = await circuit.calculateWitness(inputs, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { exist: 1 })
  })
})
