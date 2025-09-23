import { groth16 } from "snarkjs"
import { resolve } from "path"
import { isNil } from "ramda"
import {
  encodeQuery,
  pad,
  toSignal,
  encode,
  encodePath,
  encodeVal,
} from "./encoder.js"

export default class Doc {
  constructor({ size_val = 8, size_path = 4, size_json = 256, wasm, zkey }) {
    this.size_val = size_val
    this.size_path = size_path
    this.size_json = size_json
    this.wasm = wasm
    this.zkey = zkey
  }
  async getInputs({ query, json, path }) {
    return {
      json: pad(toSignal(encode(json)), this.size_json),
      path: pad(toSignal(encodePath(path)), this.size_path),
      val: isNil(query)
        ? pad(toSignal(encodeVal(this.getVal(json, path))), this.size_val)
        : pad(toSignal(encodeQuery(query)), this.size_val),
    }
  }
  _getVal(j, p) {
    if (p.length === 0) {
      return j
    } else {
      const sp = p[0].split("[")
      for (let v of sp) {
        if (/]$/.test(v)) {
          j = j[v.replace(/]$/, "") * 1]
        } else {
          j = j[v]
        }
      }
      return this._getVal(j, p.slice(1))
    }
  }
  getVal(j, p) {
    if (p === "") return j
    return this._getVal(j, p.split("."))
  }
  async genProof({ json, path, query }) {
    const inputs = await this.getInputs({ json, path, query })
    const { proof, publicSignals } = await groth16.fullProve(
      inputs,
      this.wasm,
      this.zkey,
    )
    return [
      ...proof.pi_a.slice(0, 2),
      ...proof.pi_b[0].slice(0, 2).reverse(),
      ...proof.pi_b[1].slice(0, 2).reverse(),
      ...proof.pi_c.slice(0, 2),
      ...publicSignals,
    ]
  }
}
