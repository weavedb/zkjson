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
const _json = JSON.parse(process.argv[2])
const _path = eval(process.argv[3])
const _val = eval(process.argv[4])

const size = 100
const size_json = 1000
const json = pad(encode(_json), size_json)
const path = pad(encodePath(_path), size)
const val = pad(encodeVal(_val), size)

writeFileSync(
  resolve(__dirname, "input.json"),
  JSON.stringify({ json, path, val })
)
