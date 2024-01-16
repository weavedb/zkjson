const chai = require("chai")
const { join } = require("path")
const wasm_tester = require("circom_tester").wasm

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
const DB = require("../../sdk")
const Collection = require("../../sdk")
const _json = { b: 50, a: 3123432423 }
const _path = "a"
const _val = _json[_path]

const size = 5
const size_json = 16
const level = 40
const json = pad(val2str(encode(_json)), size_json)
const path = pad(val2str(encodePath(_path)), size)
const val = pad(val2str(encodeVal(_val)), size)
describe("JSON circuit", function () {
  let circuit
  this.timeout(1000000000)

  before(async () => {
    circuit = await wasm_tester(join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const db = new DB()

    await db.init()
    await db.addCollection("colA")
    await db.insert("colA", "docA", _json)
    await db.insert("colA", "docB", { b: 2 })

    const col_root = db.tree.F.toObject(db.tree.root).toString()
    const col_res = await db.getCol("docA")

    let col_siblings = col_res.siblings
    for (let i = 0; i < col_siblings.length; i++)
      col_siblings[i] = db.tree.F.toObject(col_siblings[i])
    while (col_siblings.length < level) col_siblings.push(0)
    col_siblings = col_siblings.map(s => s.toString())
    const col_key = str2id("colA")

    const col = db.getColTree("colA")
    const root = col.tree.F.toObject(col.tree.root).toString()
    const res = await col.get("docA")
    let siblings = res.siblings
    for (let i = 0; i < siblings.length; i++)
      siblings[i] = col.tree.F.toObject(siblings[i])
    while (siblings.length < level) siblings.push(0)
    siblings = siblings.map(s => s.toString())
    const key = str2id("docA")
    const write = {
      path,
      val,
      json,
      root,
      siblings,
      key,
      col_key,
      col_siblings,
      col_root,
    }
    const w = await circuit.calculateWitness(write, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { exist: 1 })
  })
})
