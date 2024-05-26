const { str, push, arr, toArray } = require("../../sdk/uint")
const { pad, path, val } = require("../../sdk/encoder")
const { parse } = require("../../sdk/parse")
const gen = async ({ size_val = 8, size_path = 4, size_json = 256 }) => {
  const json = { hello: "world" }
  const _str = new TextEncoder().encode(JSON.stringify(json))

  let encoded = arr(256)
  for (let v of Array.from(_str)) encoded = push(encoded, 256, 76, v)
  const enc = parse(encoded, 256)
  const _path = pad(path("hello"), size_path)
  const _val = pad(path("world"), size_val)
  return {
    inputs: { encoded: str(encoded), path: _path, val: _val },
  }
}

module.exports = gen
