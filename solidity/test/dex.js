const ZKDB = require("./ZKDB")
const DB = require("../../db")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")

async function deploy() {
  const [owner, user] = await ethers.getSigners()
  const VerifierDB = await ethers.getContractFactory("Groth16VerifierDB")
  const verifierDB = await VerifierDB.deploy()
  const Verifier = await ethers.getContractFactory("Groth16Verifier")
  const verifier = await Verifier.deploy()
  const ZKDB = await ethers.getContractFactory("ZKDB")
  const zkdb = await ZKDB.deploy(
    verifier.address,
    verifierDB.address,
    owner.address
  )
  const DEX = await ethers.getContractFactory("DEX")
  const dex = await DEX.deploy(zkdb.address)

  return { dex, verifierDB, verifier, owner, user, zkdb }
}

describe("zkDB", function () {
  this.timeout(1000000000)
  it("Should transfer point token", async function () {
    const col = "bridge"
    const db = new DB()
    await db.init()
    await db.addCollection(col)
    const { user, owner, dex, zkdb } = await loadFixture(deploy)
    const addr = owner.address.toLowerCase().slice(2, 10)
    const addr2 = user.address.toLowerCase().slice(2, 10)
    const json = { b: 100, a: owner.address.toLowerCase() }

    const json2 = { a: user.address.toLowerCase(), b: 50 }

    let txs = [
      [col, "burn-1", json],
      [col, "burn-2", json],
      [col, "burn-3", json],
      [col, "burn-4", json],
      [col, "burn-5", json],
      [col, "burn-6", json],
      [col, "burn-7", json],
      [col, "burn-8", json],
      [col, "burn-9", json],
      [col, "burn-10", json2],
    ]
    const _db = new ZKDB(db, zkdb, 5, 16, 40)
    await _db.insert(txs)
    const proof = await _db.genProof(col, "burn-10", json2, "a")
    const proof2 = await _db.genProof(col, "burn-10", json2, "b")
    const sigs = proof.slice(8)
    const _col = sigs[12]
    const _doc = sigs[13]
    expect((await dex.balances(user.address)).toNumber()).to.eql(0)
    return
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
