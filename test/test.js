const {
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
} = require("../encoder")
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

  it("should encode/decode JSON", () => {
    let jsons = [
      null,
      false,
      10,
      "str",
      [1, 2, 3],
      {
        "": -1,
        bc: [null, false, 3],
        cd: { def: [4, 5, "str", { e: null, "": 6 }] },
      },
      { "": 3 },
    ]
    for (const j of jsons) {
      const encoded = encode(j)
      //console.log(encoded)
      expect(decode(encoded)).to.eql(j)
    }
  })
})
