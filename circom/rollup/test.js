const chai = require("chai")
const path = require("path")
const Scalar = require("ffjavascript").Scalar
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const DB = require("../../db")
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
} = require("../../encoder")

const size = 100
const size_json = 1000
const level = 30

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
  let tree
  let Fr
  let db
  this.timeout(1000000000)

  before(async () => {
    db = new DB()
    circuit = await wasm_tester(path.join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const db = new DB()
    await db.init()
    await db.addCollection("colA")
    await db.insert("colA", "docB", { b: 2 })
    await db.insert("colA", "docC", { c: 3 })
    await db.insert("colA", "docD", { c: 4 })
    let txs = [["colA", "docA", { a: 5 }]]

    let write, _json
    let oldRoot = []
    let newRoot = []
    let oldKey = []
    let oldValue = []
    let siblings = []
    let isOld0 = []
    let oldRoot_db = []
    let oldKey_db = []
    let oldValue_db = []
    let siblings_db = []
    let isOld0_db = []
    let newKey_db = []
    let newKey = []
    let value = []
    let _res

    for (let v of txs) {
      _json = v[2]
      const { tree, col: res2, doc: res } = await db.insert(...v)
      const icol = getInputs(res, tree)
      const idb = getInputs(res2, db.tree)
      _res = idb
      const _newKey = str2id(v[1])
      const _value = val2str(encode(_json))
      const _newKey_db = str2id(v[0])
      newRoot.push(idb.newRoot)
      oldRoot.push(icol.oldRoot)
      oldKey.push(icol.oldKey)
      oldValue.push(icol.oldValue)
      siblings.push(icol.siblings)
      isOld0.push(icol.isOld0)
      oldRoot_db.push(idb.oldRoot)
      oldKey_db.push(idb.oldKey)
      oldValue_db.push(idb.oldValue)
      siblings_db.push(idb.siblings)
      isOld0_db.push(idb.isOld0)
      newKey_db.push(_newKey_db)
      newKey.push(_newKey)
      value.push(_value)
    }

    write = {
      oldRoot,
      newRoot,
      oldKey,
      oldValue,
      siblings,
      isOld0,
      oldRoot_db,
      oldKey_db,
      oldValue_db,
      siblings_db,
      isOld0_db,
      newKey_db,
      newKey,
      value,
    }

    const w = await circuit.calculateWitness(write, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { new_root: _res.newRoot })
  })
})
