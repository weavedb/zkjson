const { describe, it } = require("node:test")
const assert = require("assert")
const { createJSON } = require("./utils.js")
const { encode: enc, decode: dec } = require("@msgpack/msgpack")
const { get, encode, decode } = require("../sdk/encoder-v2.js")
const { decode_x, encode_x, u8 } = require("../sdk/encoder-v2-1.js")
const decoder = require("../sdk/decoder.js")
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
  it.only("should encode and decode", () => {
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
