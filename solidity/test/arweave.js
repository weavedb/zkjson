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
const ZKAR = require("./ZKArweave")
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
    const zkar = new ZKAR(zkdb, 4, 8, 256)

    const _json = { a: "Hello", b: true, c: null, d: 1.1, e: 5, f: [1, 2, 3] }
    const _path = "a"
    const inputs = await zkar.genProof(_path, _json)
    const txid = "ArweaveTxID"
    expect(await zkar.query(txid, "a", _json, pkp)).to.eql("Hello")
    expect(await zkar.query(txid, "b", _json, pkp)).to.eql(true)
    expect(await zkar.query(txid, "c", _json, pkp)).to.eql(true)
    expect(await zkar.query(txid, "d", _json, pkp)).to.eql([1, 1, 11])
    expect(await zkar.query(txid, "e", _json, pkp)).to.eql(5)
    expect(await zkar.genHash(_json)).to.eql(inputs[9])
    return
  })
})
