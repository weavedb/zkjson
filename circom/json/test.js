const chai = require("chai")
const { join } = require("path")
const wasm_tester = require("circom_tester").wasm
const { fromSignal, Doc } = require("../../sdk")
const gen = require("./gen")
const gen2 = require("./gen2")
const json = {
  num: 5,
  str: "str",
  bool: false,
  bool2: true,
  null: null,
  arr: [1, 2, 3],
  arr2: [null, 1.5, false, "str"],
}
const cases = [
  ["num", ["$eq", 5]],
  ["num", ["$gt", 4]],
  ["num", ["$lt", 6]],
  ["num", ["$gte", 5]],
  ["num", ["$lte", 5]],
  ["num", ["$ne", 6]],
  ["num", ["$in", [5, 6]]],
  ["num", ["$nin", [6, 7]]],

  ["num", ["$eq", 4], true],
  ["num", ["$gt", 5], true],
  ["num", ["$lt", 4], true],
  ["num", ["$gte", 6], true],
  ["num", ["$lte", 4], true],
  ["num", ["$ne", 5], true],
  ["num", ["$in", [6, 7]], true],
  ["num", ["$nin", [5, 6, 7]], true],

  ["str", ["$eq", "str"]],
  ["str", ["$gt", "sta"]],
  ["str", ["$lt", "str2"]],
  ["str", ["$gte", "str"]],
  ["str", ["$lte", "str"]],
  ["str", ["$ne", "st"]],

  ["bool", ["$eq", false]],
  ["bool2", ["$gt", false]],
  ["bool", ["$lt", true]],
  ["bool", ["$gte", false]],
  ["bool", ["$lte", false]],
  ["bool", ["$ne", true]],

  ["arr", ["$contains", 2]],
  ["arr", ["$contains", 0], true],
  ["arr", ["$contains_any", [0, 2]]],
  ["arr", ["$contains_any", [0, 5]], true],
  ["arr", ["$contains_all", [1, 2]]],
  ["arr", ["$contains_all", [1, 2, 5]], true],
  ["arr", ["$contains_none", [0, 4, 5]]],
  ["arr", ["$contains_none", [0, 2, 4, 5]], true],

  ["arr2", ["$contains", null]],
  ["arr2", ["$contains", 1.5]],
  ["arr2", ["$contains", false]],
  ["arr2", ["$contains", "str"]],
  ["arr2", ["$contains", true], true],
  ["arr2", ["$contains_any", [1.2, "str"]]],
  ["arr2", ["$contains_any", [0, true]], true],
  ["arr2", ["$contains_all", [null, false]]],
  ["arr2", ["$contains_all", [null, false, 5]], true],
  ["arr2", ["$contains_none", ["str2", true, 1.4]]],
  ["arr2", ["$contains_none", [1.4, "str2", null]], true],
]
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

    for (let v of cases) {
      console.log(v)
      const { inputs } = await gen2({ json, path: v[0], query: v[1] })
      try {
        const w = await circuit.calculateWitness(inputs, true)
        await circuit.checkConstraints(w)
        await circuit.assertOut(w, { exist: 1 })
        if (v[2]) throw Error("should throw error")
      } catch (e) {
        if (!v[2]) {
          console.log(e)
          throw Error("should not throw error")
        }
      }
    }
  })
})
