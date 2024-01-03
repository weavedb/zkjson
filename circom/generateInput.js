const {
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
} = require("../encoder")
const { writeFileSync } = require("fs")
const { resolve } = require("path")
const _json = { b: 2 }
const _path = "b"
const _val = null
const size = 100
const size_json = 1000
const json = pad(encode(_json), size_json)
const path = pad(encodePath(_path), size)
const val = pad(encodeVal(_val), size)

writeFileSync(
  resolve(__dirname, "input.json"),
  JSON.stringify({ json, path, val })
)
