const { push, arr, toArray } = require("../../sdk/uint")
const { pad, path, val } = require("../../sdk/encoder")
const { parse } = require("../../sdk/parse")
const gen = async ({ size_val = 5, size_path = 5, size_json = 256 }) => {
  const json = { hello: "world" }
  const str = new TextEncoder().encode(JSON.stringify(json))

  let encoded = arr(256)
  for (let v of Array.from(str)) encoded = push(encoded, 256, 9, v)
  const enc = parse(encoded, 256)
  const _path = pad(path("hello"), 5)
  const _val = pad(path("world"), 5)

  return {
    inputs: { encoded: encoded, path: _path, val: _val },
  }
}

module.exports = gen
