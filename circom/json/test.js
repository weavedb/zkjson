const chai = require("chai")
const { join } = require("path")
const wasm_tester = require("circom_tester").wasm
const DB = require("../../sdk")
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

const size = 10
const size_json = 100

const _json = { a: 1.234, b: 5.5 }
const _path = "b"
const _val = _json.b
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
    const write = { json, path, val }
    const w = await circuit.calculateWitness(write, true)
    await circuit.checkConstraints(w)
    await circuit.assertOut(w, { exist: 1 })
  })
})
