const { encode, decode } = require("../encoder")
const { expect } = require("chai")
describe("zkJSON", () => {
  it("should encode and decode", () => {
    const jsons = [
      null,
      1,
      "str",
      false,
      [1, 2, 3],
      { a: 1, b: 2, c: 3 },
      { a: [1, false, null] },
      { a: [1, false, { b: 2, c: [3, null] }] },
    ]
    for (let json of jsons) {
      const encoded = encode(json)
      expect(decode(encoded)).to.eql(json)
    }
  })
})
