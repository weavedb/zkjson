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
  const DEX = await ethers.getContractFactory("DEX")
  const dex = await DEX.deploy(zkdb.address)
  return { dex, verifierDB, verifier, owner, user, zkdb }
}

describe("zkDB", function () {
  this.timeout(1000000000)
  it("Should transfer point token", async function () {
    const { user, owner, dex, zkdb } = await loadFixture(deploy)
    const addr = owner.address.toLowerCase().slice(2, 10)
    const addr2 = user.address.toLowerCase().slice(2, 10)
    const json = { b: 100, a: owner.address.toLowerCase() }
    const json2 = { a: user.address.toLowerCase(), b: 50 }

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
    let txs = [
      [col, "burn-1", json],
      [col, "burn-10", json2],
    ]
    const zkp = await db.genRollupProof(txs)
    await zkdb.commit(zkp)

    const proof = await db.genProof({
      col_id: col,
      id: "burn-10",
      json: json2,
      path: "a",
    })
    const proof2 = await db.genProof({
      col_id: col,
      id: "burn-10",
      json: json2,
      path: "b",
    })
    const sigs = proof.slice(8)
    const _col = sigs[12]
    const _doc = sigs[13]
    expect((await dex.balances(user.address)).toNumber()).to.eql(0)
    await dex.mint(_col, _doc, proof, proof2)
    expect((await dex.balances(user.address)).toNumber()).to.eql(50)
    let err = false
    try {
      await dex.mint(_col, _doc, proof, proof2)
    } catch (e) {
      err = true
    }
    expect(err).to.eql(true)
  })
})
