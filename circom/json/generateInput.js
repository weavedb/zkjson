const {
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
} = require("../../encoder")
const { writeFileSync } = require("fs")
const { resolve } = require("path")
const _json = { a: 1.234, b: 5.5 }
const _path = "b"
const _val = 5.5

const size = 100
const size_json = 1000
const json = pad(encode(_json), size_json)
const path = pad(encodePath(_path), size)
const val = pad(encodeVal(_val), size)
console.log(json, path, val)
writeFileSync(
  resolve(__dirname, "input.json"),
  JSON.stringify({ json, path, val })
)
