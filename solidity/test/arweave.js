const snarkjs = require("snarkjs")
const { splitEvery } = require("ramda")
const { newMemEmptyTrie, buildPoseidon } = require("../../sdk/circomlibjs")
const {
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
  toSignal,
} = require("../../sdk")
const { Wallet, utils } = require("ethers")
const { resolve } = require("path")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
async function deploy() {
  const [owner, otherAccount] = await ethers.getSigners()
  const pkp = Wallet.createRandom()
  const VerifierJSON = await ethers.getContractFactory("Groth16VerifierJSON")
  const verifierJSON = await VerifierJSON.deploy()
  const ZKAR = await ethers.getContractFactory("ZKArweave")
  const zkdb = await ZKAR.deploy(verifierJSON.address, pkp.address)
  return { owner, otherAccount, zkdb, pkp }
}

describe("zkArweave", function () {
  let zkdb, verifier, pkp
  this.timeout(1000000000)

  beforeEach(async () => {
    const dep = await loadFixture(deploy)
    zkdb = dep.zkdb
    const verifier = dep.verifier
    pkp = dep.pkp
  })

  it("Should verify rollup transactions", async function () {
    const tree = await newMemEmptyTrie()
    const _json = { a: "Hello", b: true, c: null, d: 1.1, e: 5, f: [1, 2, 3] }
    const _path = "a"
    const json = pad(toSignal(encode(_json)), 256)
    const _value = json
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
    const _hash = tree.F.toObject(value).toString()
    const path = pad(toSignal(encodePath(_path)), 5)
    const val = pad(toSignal(encodeVal(_json[_path])), 5)
    const _inputs = { json, path, val }
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      _inputs,
      resolve(__dirname, "../../circom/json/index_js/index.wasm"),
      resolve(__dirname, "../../circom/json/index_0001.zkey")
    )
    expect(publicSignals[1]).to.eql(_hash)
    const txid = "abcde"
    const hash = await zkdb.getMessageHash(txid, publicSignals[1])
    const sig = await pkp.signMessage(utils.arrayify(hash))
    const inputs = [
      ...proof.pi_a.slice(0, 2),
      ...proof.pi_b[0].slice(0, 2).reverse(),
      ...proof.pi_b[1].slice(0, 2).reverse(),
      ...proof.pi_c.slice(0, 2),
      ...publicSignals,
    ]
    const sigs = inputs.slice(8)
    const params = [txid, sigs.slice(2, 7), inputs, sig]
    expect(await zkdb.qString(...params)).to.eql(_json[_path])
    return
  })
})
