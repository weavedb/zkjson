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
    const doc = new Doc({ size: 5, size_json: 256 })
    const json = {
      title: "Introducing zkJSON - zero knowledge proovable JSON",
      timestamp: Date.now(),
      addr: "0xabcdefgfkjaslfjasdlkfjsalkfjasdlkfjsdal;kfjsadl;kfjsdal;kfsadjfl;asdjf",
    }
    const path = "title"
    const inputs = await doc.getInputs({
      json,
      path,
      val: json[path],
    })
    const w = await circuit.calculateWitness(inputs, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { exist: 1 })
  })
})
