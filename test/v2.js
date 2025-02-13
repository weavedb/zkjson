const { describe, it } = require("node:test")
const assert = require("assert")
const { encode: enc, decode: dec } = require("@msgpack/msgpack")
const {
  to128,
  from128,
  get,
  decodeVal,
  encodeVal,
  encodePath,
  compress,
  decompress,
  toUint8,
  fromUint8,
  fromSignal,
  toSignal,
  encode,
  decode,
} = require("../sdk/encoder-v2.js")

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

describe("zkJSON v2", function () {
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
