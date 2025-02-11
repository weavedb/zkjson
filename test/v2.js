const { describe, it } = require("node:test")
const assert = require("assert")
const { encode: enc, decode: dec } = require("@msgpack/msgpack")
const {
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
const { clone, map, equals } = require("ramda")

describe("zkJSON v2", function () {
  it("should encode and decode", () => {
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
          { id: 54321, name: "Charlie" },
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
    const ec = encode(data)
    console.log("decoded", decode(ec))
    const p = encodePath("user.friends[0].name")
    console.log("p", p)
    console.log(get(p, ec))
    assert.equal(decodeVal(get(p, ec)), "Bob")

    const str = JSON.stringify(data)

    const start3 = Date.now()
    for (let i = 0; i < 100_000; i++) {
      const a = data.user.friends[0].name
    }
    console.log("[memory]", Date.now() - start3)

    const start = Date.now()
    for (let i = 0; i < 100_000; i++) {
      const json = JSON.parse(str)
      const a = json.user.friends[0].name
    }
    console.log("[JSON.parse]", Date.now() - start)

    const start2 = Date.now()
    for (let i = 0; i < 100_000; i++) {
      const a = get(p, ec)
    }
    console.log("[zkJSON get]", Date.now() - start2)

    const start4 = Date.now()
    for (let i = 0; i < 100_000; i++) {
      const dc = decode(ec)
      const a = dc.user.friends[0].name
    }
    console.log("[zkjson decode]", Date.now() - start4)

    const msg = enc(data)
    const start5 = Date.now()
    for (let i = 0; i < 100_000; i++) {
      const dc = dec(msg)
      const a = dc.user.friends[0].name
    }
    console.log("[msgpack decode]", Date.now() - start5)
    return
  })
})
