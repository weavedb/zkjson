const { pad, toSignal, encode, encodePath, encodeVal } = require("./encoder")

module.exports = class Doc {
  constructor({ size_val = 5, size_path = 5, size_json = 256 }) {
    this.size_val = size_val
    this.size_path = size_path
    this.size_json = size_json
  }
  async getInputs({ json, path, val }) {
    return {
      json: pad(toSignal(encode(json)), this.size_json),
      path: pad(toSignal(encodePath(path)), this.size_path),
      val: pad(toSignal(encodeVal(val)), this.size_val),
    }
  }
}
