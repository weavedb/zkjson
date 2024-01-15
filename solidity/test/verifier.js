const DB = require("../../db")
const ZKDB = require("./ZKDB")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")

async function deploy() {
  const [owner, otherAccount] = await ethers.getSigners()
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
  return { verifierDB, verifier, owner, otherAccount, zkdb }
}

describe("zkDB", function () {
  let zkdb, verifier, verifierDB, db
  this.timeout(1000000000)

  beforeEach(async () => {
    const dep = await loadFixture(deploy)
    zkdb = dep.zkdb
    verifier = dep.verifier
    verifierDB = dep.verifierDB
    db = new DB()
    await db.init()
    await db.addCollection("colA")
  })

  it("Should verify rollup transactions", async function () {
    const json = { a: "Hello", b: true, c: null, d: 1.1, e: 5 }
    let txs = [
      ["colA", "docD", { d: 4 }],
      ["colA", "docD3", { d: 4 }],
      ["colA", "docD4", { d: 4 }],
      ["colA", "docD5", { d: 4 }],
      ["colA", "docD6", { d: 4 }],
      ["colA", "docD7", { d: 4 }],
      ["colA", "docD8", { d: 4 }],
      ["colA", "docA", { d: 4 }],
      ["colA", "docA", json],
    ]
    const _db = new ZKDB(db, zkdb, 5, 16, 40, 10)
    await _db.insert(txs, db, zkdb)

    const float = await _db.query("colA", "docA", json, "d")
    expect(float[2] / 10 ** float[1]).to.eql(1.1)

    const isNull = await _db.query("colA", "docA", json, "c")
    expect(isNull).to.eql(true)

    const num = await _db.query("colA", "docA", json, "e")
    expect(num).to.eql(5)

    const str = await _db.query("colA", "docA", json, "a")
    expect(str).to.eql("Hello")

    const bool = await _db.query("colA", "docA", json, "b")
    expect(bool).to.eql(true)
  })
})
