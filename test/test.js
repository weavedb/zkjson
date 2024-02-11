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
const {
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
  get
} = require("../sdk/uint")
const { parse } = require("../sdk/parse")
const { expect } = require("chai")

describe("zkJSON", () => {
  it("should operate on uints", () => {
    let c = [0, 1, 0, 0, 0, 0, 0, 0, 0]
    let nums = [2, 32, 4]
    let str = "1"
    for (let v of nums) {
      str += v.toString().length
      str += v.toString()
    }
    for (let i = 0; i < nums.length; i++) {
      c = next([+str], c)
      expect(c[0]).to.eql(nums[i])
    }

    let nums2 = [1, 2, 3]
    let c2 = [0, 1, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < nums2.length; i++) {
      c2 = next([103123], c2)
      expect(c2[0]).to.eql(nums2[i])
    }
  })

  it("should parse", () => {
    let len = 10
    const j = { ab: 3}
    const uint = new TextEncoder().encode(JSON.stringify(j))

    //console.log(enc)
    let json = arr(len)
    for (let v of Array.from(uint)) {
      json = push(json, len, 9, v)
    }
    const enc = parse(json, len)
    expect(decode(toArray(enc, len))).to.eql(j)
  })
  
  it("should handle arrays", () => {
    
  })
  
  it("should push/pop/shift/unshift", () => {
    let json = arr(5)
    for (let i = 1; i <= 15; i++) {
      json = push(json, 5, 9, i)
    }
    let c = [0, 5, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 1; i <= 15; i++) {
      c = next(json, c)
      expect(c[0]).to.eql(i)
    }
    expect(length(json, 5)).to.eql(15)
    expect(last(json, 5)).to.eql(15)
    for (let i = 0; i < 9; i++) pop(json, 5)
    expect(json).to.eql([106123456, 0, 0, 0, 0])

    let json2 = arr(1)
    json2 = push(json2, 1, 9, 2)
    json2 = push(json2, 1, 9, 1234)
    json2 = pop(json2, 1)
    expect(json2).to.eql([112])

    json2 = arr(2)
    json2 = push(json2, 2, 9, 2)
    json2 = push(json2, 2, 9, 123456)
    json2 = pop(json2, 2)
    expect(json2).to.eql([112, 0])

    let json3 = arr(1)
    json3 = unshift(json3, 1, 9, 5)
    json3 = unshift(json3, 1, 9, 6)
    json3 = unshift(json3, 1, 9, 7)
    expect(json3).to.eql([103765])
    json3 = shift(json3, 1, 9)
    expect(json3).to.eql([11615])
    json3 = shift(json3, 1, 9)
    expect(json3).to.eql([115])

    let json4 = arr(1)
    json4 = unshift(json4, 1, 9, 5)
    json4 = unshift(json4, 1, 9, 6)
    json4 = unshift(json4, 1, 9, 7)
    expect(json4).to.eql([103765])
    json4 = slice(json4, 1, 9, 1, 2)
    expect(json4).to.eql([116])
    json4 = insert(json4, 1, 9, 0, 8)
    expect(json4).to.eql([11816])
    json4 = replace(json4, 1, 9, 1, 9)
    expect(json4).to.eql([11819])

    expect(get(json4,1,1)).to.eql(9)
  })

  it("should push with digit overflow", () => {
    let json = arr(4)
    json = push(json, 4, 9, 3)
    json = push(json, 4, 9, 12345678)
    json = push(json, 4, 9, 12345678)
    expect(json).to.eql([1134123, 14456278, 141234456, 1278])
  })

  it("should push with single digit", () => {
    let json = arr(1)
    json = push(json, 1, 9, 1)
    json = push(json, 1, 9, 2)
    json = push(json, 1, 9, 3)
    json = push(json, 4, 9, 4)
    expect(json[0]).to.eql(1041234)
  })

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

