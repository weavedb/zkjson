const { describe, it } = require("node:test")
const assert = require("assert")
const { createJSON } = require("./utils.js")
const { encode: enc, decode: dec } = require("@msgpack/msgpack")
const { get, encode, decode } = require("../sdk/encoder-v1_5.js")
const { encode_x, u8 } = require("../sdk/encoder-v2.js")
const { decode_x, decoder } = require("../sdk/decoder-v2.js")
const { range } = require("ramda")
const { encode: encode1, decode: decode1 } = require("../sdk/encoder.js")

let data = {
  user: {
    id: 12345,
    name: "Alice",
    email: "alice@example.com",
    preferences: {
      theme: "dark",
      notifications: true,
      language: "en",
    },
    friends: [
      { id: 67890, name: "Bob" },
      { id: 54321, name: "Charlie", favs: ["apple", "orange"] },
    ],
  },
  posts: [
    {
      id: 1,
      title: "Hello World",
      content: "This is my first post!",
      tags: ["intro", "hello"],
    },
    {
      id: 2,
      title: "Another Post",
      content: "More content here.",
      tags: ["update"],
    },
  ],
}

// empty object
describe("zkJSON v2", function () {
  it.only("should compare sizes", () => {
    let d = new decoder()
    let u = new u8(100)
    let wins = 0
    console.log()
    for (let v of range(1, 101)) {
      console.log()
      data = createJSON()
      const _e = encode_x(data, u)
      const msg = enc(data)
      let jsize = Buffer.from(JSON.stringify(data), "utf8").length
      let msize = Buffer.from(msg).length
      let zksize = Buffer.from(_e).length
      console.log(
        v,
        "[j]",
        jsize,
        "[z]",
        zksize,
        "[m]",
        msize,
        "[d]",
        zksize - msize,
        "==========================================",
      )
      console.log(data)
      if (msize > zksize) wins++
    }
    console.log()
    console.log("[wins]", wins)
    console.log()
  })

  it("should encode with v2", () => {
    console.log()
    data = createJSON()

    console.log()
    let d = new decoder()
    let u = new u8(100, true)

    const _e = encode_x(data, u)
    const msg = enc(data)
    const decoded = decode_x(_e, d)
    console.log("decoded:", decoded)
    console.log(data)
    assert.deepEqual(data, decoded)
    d.show()
    console.log()
    console.log("zk", _e)
    console.log("msg", msg)
    console.log()
    console.log("[json size]", Buffer.from(JSON.stringify(data), "utf8").length)
    console.log("[zkjson v2 size]", Buffer.from(_e).length)
    console.log("[msgpack size]", Buffer.from(msg).length)
  })

  it.only("should benchmark", () => {
    const count = 100000
    let d = new decoder()
    let u = new u8(100)
    data = createJSON()
    /*data = {
      HmOjTx: {
      I0: { Mgo: true, c: "Pl13CG8", e: 93, PWUtvM: "KdOl" },
        uiE5: { ZMD: 62, MrOl: 82, lxMJx: true, iKaXW: "hXZ8hVKxU" },
      },
      AM1: [
        [null, null],
        { f: false, BYfLR: "PTs87Nt" },
        { OZrnk: "6GL2JrqLKz", uaDS: false },
        { UiFU: "52l6yvMn", bNF: "5TNV" },
      ],
      "9kVj": [{ o1: 9, W: "LF1cyALKyi" }, [null, 11]],
      Cgbz: {
        67: [null, true],
        OF9Rn: { aoIf3f: 23, Gp: true, rYlN: 7, Xnfo: null },
        Kc0QD: { v: false, U: true },
        Pr: { t: "xhoND0UG", LNkT1L: null, A87h: 26, "2f4F6": 88 },
      },
    }*/

    console.log("[json size]", Buffer.from(JSON.stringify(data), "utf8").length)
    const msg = enc(data)
    console.log("[msgpack size]", Buffer.from(msg).length)
    const _e = encode_x(data, u)
    console.log("[zkjson v2 size]", Buffer.from(_e).length)

    console.log()
    const start0 = Date.now()
    for (let i = 0; i < count; i++) enc(data)
    console.log("[msgpack encode]", Date.now() - start0)

    const start1 = Date.now()
    for (let i = 0; i < count; i++) encode_x(data, u)
    console.log("[zkjson v2 encode]", Date.now() - start1)

    const start5 = Date.now()
    for (let i = 0; i < count; i++) JSON.stringify(data)
    console.log("[json stringify]", Date.now() - start5)
    console.log()

    const start2 = Date.now()
    for (let i = 0; i < count; i++) dec(msg)
    console.log("[msgpack decode]", Date.now() - start2)

    const start3 = Date.now()
    for (let i = 0; i < count; i++) decode_x(_e, d)
    console.log("[zkjson decode]", Date.now() - start3)

    const str = JSON.stringify(data)
    const start4 = Date.now()
    for (let i = 0; i < count; i++) JSON.parse(str)
    console.log("[json parse]", Date.now() - start4)
    console.log()

    console.log(data)
    console.log()
  })

  it.only("should encode and decode random json", () => {
    let d = new decoder()
    let u = new u8(1000)
    for (let v of range(0, 1000)) {
      let data0 = createJSON()
      const res0 = encode_x(data0, u)
      const decoded = decode_x(res0, d)
      assert.deepEqual(decoded, data0)
    }
  })

  it("should encode and decode", () => {
    let data0 = createJSON()
    data0 = -3.223432
    console.log()
    console.log(data0)
    console.log()
    let u = new u8(1000, true)
    const res0 = encode_x(data0, u)
    let d = new decoder()
    console.log()
    const decoded = decode_x(res0, d)
    console.log(decoded)
    console.log("decoded", JSON.stringify(decoded))
    console.log()
    assert.deepEqual(decoded, data0)
    return
    const msg = enc(data0)
    console.log()
    console.log(
      "size: [json]",
      Buffer.from(JSON.stringify(data0), "utf8").length,
      "[msg]",
      Buffer.from(msg).length,
      "[zkj]",
      Buffer.from(res0).length,
    )
    console.log()
    return

    const num = 100000
    const start = Date.now()
    for (let i = 0; i < num; i++) encode_x(data0, u)
    const dur = Date.now() - start
    const start0 = Date.now()
    for (let i = 0; i < num; i++) enc(data0)
    const dur0 = Date.now() - start0
    console.log("speed: [msg]", dur0, "[zkj]", dur)
    console.log()
    console.log("[msg]", msg)
    console.log("[zkj]", res0)
    console.log()
    return
    console.log(decode(res0))
    console.log(encode(data0, { offset: false, sort: false, dict: false }))
  })

  it("should encode and decode", () => {
    console.log("size comparison..............................................")
    console.log("[json size]", Buffer.from(JSON.stringify(data), "utf8").length)
    const msg = enc(data)
    console.log("[msgpack size]", Buffer.from(msg).length)
    const _e0 = encode1(data)
    console.log("zkjson v1 size", Buffer.from(_e0).length)

    const _e = encode(data, { offset: false, sort: false })
    console.log("zkjson(dic) size", Buffer.from(_e).length)
    const _e2 = encode(data, { dict: false, sort: false })
    console.log("zkjson(offset) size", Buffer.from(_e2).length)
    assert.deepEqual(decode(_e2), data)
    const _e3 = encode(data)
    console.log("zkjson(dic + offset) size", Buffer.from(_e3).length)
    console.log()
    console.log(
      "encode comparison..............................................",
    )
    const start0 = Date.now()
    for (let i = 0; i < 1000; i++) enc(data)
    console.log("[msgpack encode]", Date.now() - start0)

    const start91 = Date.now()
    for (let i = 0; i < 1000; i++)
      encode(data, { dict: false, offset: false, sort: false })
    console.log("[zkjson encode no dict]", Date.now() - start91)

    const start9 = Date.now()
    for (let i = 0; i < 1000; i++) encode(data)
    console.log("[zkjson encode]", Date.now() - start9)

    const start11 = Date.now()
    for (let i = 0; i < 1000; i++) encode1(data)
    console.log("[zkjson v1 encode]", Date.now() - start11)

    console.log()
    console.log("get comparison..............................................")
    let a = null
    const start0_2 = Date.now()
    for (let i = 0; i < 1000; i++) a = dec(msg).user.name
    console.log("[msgpack get]", Date.now() - start0_2, a)

    const start0_3 = Date.now()
    for (let i = 0; i < 1000; i++) a = decode1(_e0).user.name
    console.log("[zkjson v1 get]", Date.now() - start0_3, a)

    const start0_4 = Date.now()
    for (let i = 0; i < 1000; i++) a = get(_e3, "user.name")
    console.log("[zkjson v2 get]", Date.now() - start0_4, a)
    console.log(get(_e3, "user.name"))
    return
  })
})
