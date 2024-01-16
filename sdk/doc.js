const { pad, toSignal, encode, encodePath, encodeVal } = require("./encoder")

module.exports = class Doc {
  constructor({ size = 16, size_json = 100 }) {
    this.size = size
    this.size_json = size_json
  }
  async getInputs({ json, path, val }) {
    return {
      json: pad(toSignal(encode(json)), this.size_json),
      path: pad(toSignal(encodePath(path)), this.size),
      val: pad(toSignal(encodeVal(val)), this.size),
    }
  }
}
