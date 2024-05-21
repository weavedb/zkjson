const { DB } = require("../../sdk")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { resolve } = require("path")
async function deploy() {
  const [owner, user] = await ethers.getSigners()
  const VerifierDB = await ethers.getContractFactory("Groth16VerifierDB")
  const verifierDB = await VerifierDB.deploy()
  const Verifier = await ethers.getContractFactory("Groth16VerifierRU")
  const verifier = await Verifier.deploy()
  const ZKDB = await ethers.getContractFactory("SimpleRU")
  const zkdb = await ZKDB.deploy(
    verifier.address,
    verifierDB.address,
    owner.address,
  )
  const Token = await ethers.getContractFactory("Token")
  const token = await Token.deploy()
  const ZKBridge = await ethers.getContractFactory("ZKBridge")
  const bridge = await ZKBridge.deploy(zkdb.address, token.address)
  return { bridge, verifierDB, verifier, owner, user, zkdb, token }
}

describe("zkDB", function () {
  this.timeout(0)
  it("Should transfer point token", async function () {
    const { token, user, owner, bridge, zkdb } = await loadFixture(deploy)

    const addr = owner.address.toLowerCase().slice(2, 10)
    const addr2 = user.address.toLowerCase().slice(2, 10)
    const json = { amount: 100, to: user.address.toLowerCase() }

    const db = new DB({
      wasmRU: resolve(
        __dirname,
        "../../circom/build/circuits/rollup/index_js/index.wasm",
      ),
      zkeyRU: resolve(
        __dirname,
        "../../circom/build/circuits/rollup/index_0001.zkey",
      ),
      wasm: resolve(
        __dirname,
        "../../circom/build/circuits/db/index_js/index.wasm",
      ),
      zkey: resolve(
        __dirname,
        "../../circom/build/circuits/db/index_0001.zkey",
      ),
    })
    await db.init()
    const col = await db.addCollection()
    let txs = [[col, "abc", json]]
    const zkp = await db.genRollupProof(txs)
    await zkdb.commit(zkp)

    const proof = await db.genProof({
      col_id: col,
      id: "abc",
      json: json,
      path: "to",
    })
    const proof2 = await db.genProof({
      col_id: col,
      id: "abc",
      json: json,
      path: "amount",
    })
    const sigs = proof.slice(8)
    const _col = sigs[12]
    const _doc = sigs[13]

    expect((await token.balanceOf(user.address)).toNumber()).to.eql(0)
    await bridge.bridge(_col, _doc, proof, proof2)
    expect((await token.balanceOf(user.address)).toNumber()).to.eql(100)
  })
})
