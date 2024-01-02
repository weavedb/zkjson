const { encode, decode } = require("../encoder")
const { expect } = require("chai")

describe("zkJSON", () => {
  it.only("should encode/decode JSON", () => {
    const json = {
      "": -1,
      bc: [null, false, 3],
      cd: { def: [4, 5, "str", { e: null }] },
    }
    const encoded = encode(json)
    expect(decode(encoded)).to.eql(json)
  })
})
