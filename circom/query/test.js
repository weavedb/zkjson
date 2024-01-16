const chai = require("chai")
const path = require("path")
const wasm_tester = require("circom_tester").wasm
const { DB } = require("../../sdk")

describe("query circuit", function () {
  let circuit
  let db
  this.timeout(1000000000)

  before(async () => {
    circuit = await wasm_tester(path.join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const db = new DB({ size: 5, size_json: 16, level: 50 })
    await db.init()
    await db.addCollection("colA")
    await db.addCollection("colB")
    await db.insert("colB", "docB", { b: 2 })
    await db.insert("colA", "docB", { b: 2 })
    await db.insert("colA", "docC", { c: 3 })
    await db.insert("colA", "docA", { c: 4 })
    const inputs = await db.getQueryInputs({
      col_id: "colA",
      id: "docA",
      json: { a: 5, b: true },
    })
    const w = await circuit.calculateWitness(inputs, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { new_root: db.tree.F.toObject(db.tree.root) })
  })
})
