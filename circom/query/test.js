const chai = require("chai")
const path = require("path")
const wasm_tester = require("circom_tester").wasm
const gen = require("./gen")
describe("query circuit", function () {
  let circuit
  this.timeout(1000000000)

  before(async () => {
    circuit = await wasm_tester(path.join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const { db, inputs } = await gen({})
    const w = await circuit.calculateWitness(inputs, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { new_root: db.tree.F.toObject(db.tree.root) })
  })
})
