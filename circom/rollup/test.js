const chai = require("chai")
const { range } = require("ramda")
const path = require("path")
const Scalar = require("ffjavascript").Scalar
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const gen = require("./gen")
const {
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
  str2id,
  val2str,
} = require("../../sdk")

const size = 5
const size_json = 16
const level = 40
const size_txs = 10
const getInputs = (res, tree) => {
  const isOld0 = res.isOld0 ? "1" : "0"
  const oldRoot = tree.F.toObject(res.oldRoot).toString()
  const newRoot = tree.F.toObject(res.newRoot).toString()
  const oldKey = res.isOld0 ? "0" : tree.F.toObject(res.oldKey).toString()
  const oldValue = res.isOld0 ? "0" : tree.F.toObject(res.oldValue).toString()
  let siblings = res.siblings
  for (let i = 0; i < siblings.length; i++)
    siblings[i] = tree.F.toObject(siblings[i])
  while (siblings.length < level) siblings.push(0)
  siblings = siblings.map(s => s.toString())
  return { isOld0, oldRoot, oldKey, oldValue, siblings, newRoot }
}

describe("SMT Verifier test", function () {
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
