const {
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
} = require("../sdk")
const { expect } = require("chai")

describe("zkJSON", () => {
  it("should encode/decode path", () => {
    let paths = ["a....b", "[1][2]", ""]
    for (const p of paths) {
      const encoded = encodePath(p)
      //console.log(encoded)
      expect(decodePath(encoded)).to.eql(p)
    }
  })
  it("should encode/decode value", () => {
    let vals = [-3, "", null, false, 10, "str"]
    for (const v of vals) {
      const encoded = encodeVal(v)
      //console.log(encoded)
      expect(decodeVal(encoded)).to.eql(v)
    }
  })

  it.only("should encode/decode JSON", () => {
    const enc = encode({
      a: 1,
      c: false,
      b: { e: null, d: "four" },
      f: 3.14,
      ghi: [5, 6, 7],
    })
    console.log(toSignal(encode({ a: 1 })))
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
      expect(fromSignal(toSignal(encoded))).to.eql(encoded)
      expect(decode(encoded)).to.eql(j)
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
      //console.log(encoded)
      expect(decodeQuery(encoded)).to.eql(v)
    }
  })
})
