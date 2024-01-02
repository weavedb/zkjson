const {
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
    const path = "b.a[13].3.cde[3]"
    expect(decodePath(encodePath(path))).to.eql(path)
  })
  it("should encode/decode value", () => {
    const val = "null"
    expect(decodeVal(encodeVal(val))).to.eql(val)
  })

  it("should encode/decode JSON", () => {
    const json = {
      "": -1,
      bc: [null, false, 3],
      cd: { def: [4, 5, "str", { e: null }] },
    }
    const encoded = encode(json)
    expect(decode(encoded)).to.eql(json)
  })
})
