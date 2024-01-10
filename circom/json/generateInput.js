const {
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
  val2str,
} = require("../../encoder")
const { writeFileSync } = require("fs")
const { resolve } = require("path")
const _json = { a: 1.234, b: 5.5 }
const _path = "b"
const _val = _json.b

const size = 10
const size_json = 100
const json = pad(val2str(encode(_json)), size_json)
const path = pad(val2str(encodePath(_path)), size)
const val = pad(val2str(encodeVal(_val)), size)

writeFileSync(
  resolve(__dirname, "input.json"),
  JSON.stringify({ json, path, val })
)
