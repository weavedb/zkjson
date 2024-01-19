const snarkjs = require("snarkjs")
const { utils } = require("ethers")
const { newMemEmptyTrie, buildPoseidon } = require("../../sdk/circomlibjs")
const { resolve } = require("path")
const { range, splitEvery } = require("ramda")
const {
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
  str2id,
  toSignal,
} = require("../../sdk")

module.exports = class ZKArweave {
  constructor(zkdb, size, size_json) {
    this.zkdb = zkdb
    this.size = size
    this.size_json = size_json
  }
  async genProof(_path, _json) {
    const json = pad(toSignal(encode(_json)), this.size_json)
    const path = pad(toSignal(encodePath(_path)), this.size)
    const val = pad(toSignal(encodeVal(_json[_path])), this.size)
    const _inputs = { json, path, val }
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      _inputs,
      resolve(__dirname, "../../circom/json/index_js/index.wasm"),
      resolve(__dirname, "../../circom/json/index_0001.zkey")
    )
    return [
      ...proof.pi_a.slice(0, 2),
      ...proof.pi_b[0].slice(0, 2).reverse(),
      ...proof.pi_b[1].slice(0, 2).reverse(),
      ...proof.pi_c.slice(0, 2),
      ...publicSignals,
    ]
  }
  async genHash(_json) {
    const _value = pad(toSignal(encode(_json)), this.size_json)
    const tree = await newMemEmptyTrie()
    const poseidon = await buildPoseidon()
    let _hash_value = _value
    if (_value.length === 256) {
      _hash_value = []
      for (let v of splitEvery(16, _value)) {
        const poseidon = await buildPoseidon()
        const value = poseidon(v)
        _hash_value.push(value)
      }
    }
    const value = poseidon(_hash_value)
    return tree.F.toObject(value).toString()
  }

  async query(txid, _path, _json, pkp) {
    const val = _json[_path]
    const inputs = await this.genProof(_path, _json)
    const hash = await this.zkdb.getMessageHash(txid, inputs[9])
    const sig = await pkp.signMessage(utils.arrayify(hash))
    const sigs = inputs.slice(8)
    const params = [txid, sigs.slice(2, 7), inputs, sig]
    let type =
      val === null
        ? 0
        : typeof val === "string"
        ? 3
        : typeof val === "boolean"
        ? 1
        : typeof val === "number"
        ? Number.isInteger(val)
          ? 2
          : 2.5
        : 4
    switch (type) {
      case 0:
        return await this.zkdb.qNull(...params)
      case 1:
        return await this.zkdb.qBool(...params)
      case 2:
        return (await this.zkdb.qInt(...params)).toString() * 1
      case 2.5:
        return (await this.zkdb.qFloat(...params)).map(n => n.toString() * 1)
      case 3:
        return await this.zkdb.qString(...params)
      case 4:
        return (await this.zkdb.qRaw(...params)).map(n => n.toString() * 1)
    }
  }
}
