import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import { resolve } from "path"
import {
  toIndex,
  fromIndex,
  path,
  val,
  toSignal,
  fromSignal,
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
  encodeQuery,
  decodeQuery,
  DB,
  Doc,
  parse,
} from "../sdk/dist/esm/index.js"

import {
  insert,
  slice,
  unshift,
  shift,
  toArray,
  pop,
  length,
  push,
  next,
  arr,
  last,
  replace,
  get,
  pushArray,
  arrPush,
  arrGet,
  popArray,
  remove,
  bn,
  digits,
} from "../sdk/dist/esm/uint.js"

describe("zkJSON", () => {
  it("should generate proofs", { timeout: Infinity }, async () => {
    const wasm = resolve(
      import.meta.dirname,
      "../circom/build/circuits/db/index_js/index.wasm",
    )
    const zkey = resolve(
      import.meta.dirname,
      "../circom/build/circuits/db/index_0001.zkey",
    )
    const bob = { name: "Bob", age: 5 }
    const alice = { name: "Alice", age: 10 }
    const zkdb = new DB({ wasm, zkey })
    await zkdb.init()
    await zkdb.addCollection()
    await zkdb.insert(0, "Bob", bob)
    const zkp = await zkdb.genProof({
      json: bob,
      col_id: 0,
      path: "name",
      id: "Bob",
    })
    await zkdb.addCollection()
    await zkdb.insert(1, "Alice", alice)
    const zkp2 = await zkdb.genProof({
      json: alice,
      col_id: 1,
      path: "age",
      id: "Alice",
      query: ["$gt", 5],
    })
    assert.deepStrictEqual(zkp2[8], "1")
    const zkp3 = await zkdb.genProof({
      json: alice,
      col_id: 1,
      path: "age",
      id: "Alice",
      query: ["$lt", 5],
    })
    assert.deepStrictEqual(zkp3[8], "0")
  })

  it("should operate on uints 3", () => {
    let len = 256
    const json = {
      str: "Hello, World!",
      int: 123,
      float: 1.23,
      bool: true,
      null: null,
      arr: [1, 2, 3],
    }
    const str = new TextEncoder().encode(JSON.stringify(json))
    let encoded = arr(len)
    for (let v of Array.from(str)) encoded = push(encoded, len, 76, v)
    const enc = parse(encoded, len, 76)
    assert.deepStrictEqual(decode(toArray(enc, len)), json)
  })

  it("should operate on uints 2", () => {
    const json = { a: [{ b: 1 }] }
    const len = 1
    const str = new TextEncoder().encode(JSON.stringify(json))
    let encoded = arr(len)
    for (let v of Array.from(str)) encoded = push(encoded, len, 76, v)
    const enc = parse(encoded, len, 76)
  })

  it("should operate on uints", () => {
    let c = bn([0, 1, 0, 0, 0, 0, 0, 0, 0])
    let nums = bn([2, 32, 4])
    let str = "1"
    for (let v of nums) {
      str += v.toString().length
      str += v.toString()
    }
    for (let i = 0; i < nums.length; i++) {
      c = next([BigInt(str)], c)
      assert.deepStrictEqual(c[0], nums[i])
    }
    let nums2 = bn([1, 2, 3])
    let c2 = bn([0, 1, 0, 0, 0, 0, 0, 0, 0])
    for (let i = 0; i < nums2.length; i++) {
      c2 = next([103123], c2)
      assert.deepStrictEqual(c2[0], nums2[i])
    }
  })

  it("should parse", () => {
    const len = 2
    const digit = 76
    const j = { test: 3 }
    const uint = new TextEncoder().encode(JSON.stringify(j))
    let json = arr(len)
    for (let v of Array.from(uint)) {
      json = push(json, len, digit, v)
    }
    const enc = parse(json, len, digit)
    assert.deepStrictEqual(decode(toArray(enc, len)), j)
  })

  it("should handle arrays", () => {
    let json = arr(5)
    for (let i = 1; i <= 5; i++) {
      json = push(json, 5, 9, i)
    }
    let json2 = arr(3)
    for (let i = 1; i <= 3; i++) {
      json2 = push(json2, 3, 9, i)
    }

    let ajson = arr(10)
    ajson = pushArray(ajson, 10, 9, json, 5)
    ajson = pushArray(ajson, 10, 9, json2, 3)
    ajson = arrPush(ajson, 10, 9, 1, 10)
    assert.deepStrictEqual(arrGet(ajson, 10, 9, 1, 3), 10n)
    ajson = popArray(ajson, 10, 9)
    assert.deepStrictEqual(toArray(ajson, 9), [1, 5, 1, 2, 3, 4, 5])
  })

  it("should push/pop/shift/unshift", () => {
    let json = arr(5)
    for (let i = 1; i <= 15; i++) {
      json = push(json, 5, 9, i)
    }
    let c = bn([0, 5, 0, 0, 0, 0, 0, 0, 0])
    for (let i = 1n; i <= 15; i++) {
      c = next(json, c)
      assert.deepStrictEqual(c[0], i)
    }
    assert.deepStrictEqual(length(json, 5), 15n)
    assert.deepStrictEqual(last(json, 5), 15n)
    for (let i = 0; i < 9; i++) json = pop(json, 5)
    assert.deepStrictEqual(json, bn([106123456, 0, 0, 0, 0]))
    let json2 = arr(1)
    json2 = push(json2, 1, 9, 2)
    json2 = push(json2, 1, 9, 1234)
    json2 = pop(json2, 1)
    assert.deepStrictEqual(json2, bn([112]))

    json2 = arr(2)
    json2 = push(json2, 2, 9, 2)
    json2 = push(json2, 2, 9, 123456)
    json2 = pop(json2, 2)
    assert.deepStrictEqual(json2, bn([112, 0]))

    let json3 = arr(1)
    json3 = unshift(json3, 1, 9, 5)
    json3 = unshift(json3, 1, 9, 6)
    json3 = unshift(json3, 1, 9, 7)
    assert.deepStrictEqual(json3, bn([103765]))
    json3 = shift(json3, 1, 9)
    assert.deepStrictEqual(json3, bn([11615]))
    json3 = shift(json3, 1, 9)
    assert.deepStrictEqual(json3, bn([115]))

    let json4 = arr(1)
    json4 = unshift(json4, 1, 9, 5)
    json4 = unshift(json4, 1, 9, 6)
    json4 = unshift(json4, 1, 9, 7)
    assert.deepStrictEqual(json4, bn([103765]))
    json4 = slice(json4, 1, 9, 1, 2)
    assert.deepStrictEqual(json4, bn([116]))

    json4 = insert(json4, 1, 9, 0, 8)
    assert.deepStrictEqual(json4, bn([11816]))
    json4 = replace(json4, 1, 9, 1, 9)
    assert.deepStrictEqual(json4, bn([11819]))

    assert.deepStrictEqual(get(json4, 1, 1), 9n)
  })

  it("should push with digit overflow", () => {
    let json = arr(4)
    let len = 10
    json = push(json, 4, len, 3)
    json = push(json, 4, len, 12345678)
    json = push(json, 4, len, 12345678)
    assert.deepStrictEqual(json, bn([113, 1812345678, 1812345678, 0]))
  })

  it("should push with single digit", () => {
    let json = arr(1)
    json = push(json, 1, 9, 1)
    json = push(json, 1, 9, 2)
    json = push(json, 1, 9, 3)
    json = push(json, 1, 9, 4)
    assert.deepStrictEqual(json[0], 1041234n)
  })

  it("should encode/decode path", () => {
    let paths = ["a....b", "[1][2]", ""]
    for (const p of paths) {
      const encoded = encodePath(p)
      //console.log(encoded)
      assert.deepStrictEqual(decodePath(encoded), p)
    }
  })

  it("should encode/decode value", () => {
    let vals = [-3, "", null, false, 10, "str"]
    for (const v of vals) {
      const encoded = encodeVal(v)
      //console.log(encoded)
      assert.deepStrictEqual(decodeVal(encoded), v)
    }
  })

  it("should encode/decode JSON", () => {
    const enc = encode({
      a: 1,
      c: false,
      b: { e: null, d: "four" },
      f: 3.14,
      ghi: [5, 6, 7],
    })
    let jsons = [
      null,
      false,
      10,
      "str",
      [1.0, 2, 3],
      {
        "": -1,
        bc: [null, false, 3],
        cd: { def: [4, 5, "str", { e: null, "": 6 }] },
      },
      { "": -3.3 },
    ]
    for (const j of jsons) {
      const encoded = encode(j)
      //console.log(encoded)
      assert.deepStrictEqual(fromSignal(toSignal(encoded)), encoded)
      assert.deepStrictEqual(decode(encoded), j)
    }
  })

  it("should encode/decode query", () => {
    let vals = [
      ["$eq", 3],
      ["$ne", 3],
      ["$gt", 3],
      ["$gte", 3],
      ["$lt", 3],
      ["$lte", 3],
      ["$in", [1, 2, 3]],
      ["$nin", [1, 2, 3]],
    ]
    for (const v of vals) {
      const encoded = encodeQuery(v)
      assert.deepStrictEqual(decodeQuery(encoded), v)
    }
  })

  it("should convert to/from index", () => {
    const index = toIndex("bob_1")
    assert.deepStrictEqual(index, "422775512881")
    assert.deepStrictEqual(fromIndex(index), "bob_1")
  })
})
