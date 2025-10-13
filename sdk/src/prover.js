import { groth16 } from "snarkjs"
import { toIndex } from "./encoder.js"

export default class Prover {
  constructor({ wasm, zkey }) {
    this.wasm = wasm
    this.zkey = zkey
  }

  _getVal(j, p) {
    if (p.length === 0) return j
    else {
      const sp = p[0].split("[")
      for (let v of sp) {
        if (/]$/.test(v)) j = j[v.replace(/]$/, "") * 1]
        else j = j[v]
      }
      return this._getVal(j, p.slice(1))
    }
  }

  getVal(j, p) {
    if (p === "") return j
    return this._getVal(j, p.split("."))
  }

  async genProof(inputs) {
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
