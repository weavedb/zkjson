const { pad, toSignal, encodePath, DB } = require("../../sdk")
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
  let zkdb, verifier, verifierDB, db, col_id
  this.timeout(1000000000)

  beforeEach(async () => {
    const dep = await loadFixture(deploy)
    zkdb = dep.zkdb
    verifier = dep.verifier
    verifierDB = dep.verifierDB
    db = new DB({
      level: 100,
      size_path: 5,
      size_val: 5,
      size_json: 256,
      size_txs: 10,
      level_col: 8,
    })
    await db.init()
    col_id = await db.addCollection("colA")
  })

  it("Should verify rollup transactions", async function () {
    const json = { a: "Hello", b: true, c: null, d: 1.1, e: 5, f: [1, 2, 3] }
    let txs = [
      [col_id, "docD", { d: 4 }],
      [col_id, "docD3", { d: 4 }],
      [col_id, "docD4", { d: 4 }],
      [col_id, "docD5", { d: 4 }],
      [col_id, "docD6", { d: 4 }],
      [col_id, "docD7", { d: 4 }],
      [col_id, "docD8", { d: 4 }],
      [col_id, "docA", { d: 4 }],
      [col_id, "docA", json],
    ]
    const _db = new ZKDB(db, zkdb, 5, 5, 256, 100, 10, 8)
    await _db.insert(txs, db, zkdb)

    const float = await _db.query(col_id, "docA", json, "d")
    expect(float[2] / 10 ** float[1]).to.eql(1.1)

    const isNull = await _db.query(col_id, "docA", json, "c")
    expect(isNull).to.eql(true)

    const num = await _db.query(col_id, "docA", json, "e")
    expect(num).to.eql(5)

    const str = await _db.query(col_id, "docA", json, "a")
    expect(str).to.eql("Hello")

    const bool = await _db.query(col_id, "docA", json, "b")
    expect(bool).to.eql(true)

    const array = await _db.query(col_id, "docA", json, "f")
    expect(
      (await zkdb.getInt(toSignal(encodePath("[1]")), array)).toString() * 1
    ).to.eql(2)
  })
})
