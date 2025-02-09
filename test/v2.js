const { describe, it } = require("node:test")
const assert = require("assert")

const {
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
        frien: [
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
    data = {
      a: 1,
      c: false,
      b: { e: null, d: "four" },
      f: 3.14159, // todo: fix js fraction issue
      ghi: [5, 6, 7],
    }
    const ec = encode(data)
    const ec2 = encode(data, true)
    console.log("json", JSON.stringify(data).length)
    console.log("dic", ec.length, compress(ec).length, toSignal(ec).length)
    console.log("nodic", ec2.length, compress(ec2).length, toSignal(ec2).length)
    console.log("decoded", decode(clone(ec)))
    assert.deepEqual(decode(ec), data)
    return
  })
})
