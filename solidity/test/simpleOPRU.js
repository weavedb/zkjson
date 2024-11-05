const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { toIndex, path, DB } = require("../../sdk")
const { resolve } = require("path")
const { expect } = require("chai")

async function deploy() {
  const [committer] = await ethers.getSigners()
  const VerifierRU = await ethers.getContractFactory("Groth16VerifierRU")
  const verifierRU = await VerifierRU.deploy()
  const VerifierDB = await ethers.getContractFactory("Groth16VerifierDB")
  const verifierDB = await VerifierDB.deploy()

  const MyRU = await ethers.getContractFactory("SimpleOPRU")
  const myru = await MyRU.deploy(
    verifierRU.address,
    verifierDB.address,
    committer.address,
  )
  return { myru, committer }
}

describe("MyRollup", function () {
  let myru, committer, db, col_id, ru
  this.timeout(0)

  beforeEach(async () => {
    const dep = await loadFixture(deploy)
    myru = dep.myru
    committer = dep.committer
  })

  it("should verify rollup transactions", async function () {
    db = new DB({
      level: 168,
      size_path: 4,
      size_val: 8,
      size_json: 256,
      size_txs: 10,
      level_col: 8,
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
    col_id = await db.addCollection()
    const people = [{ name: "Bob", age: 5 }]
    let txs = people.map(v => {
      return [col_id, v.name, v]
    })

    for (const v of txs) {
      await db.insert(...v)
    }
    const root = db.tree.F.toObject(db.tree.root).toString()

    await myru.commitRoot(root)

    const zkp2 = await db.genProof({
      json: people[0],
      col_id,
      path: "name",
      id: "Bob",
    })

    expect(
      await myru.qString([col_id, toIndex("Bob"), ...path("name")], zkp2),
    ).to.eql("Bob")

    const zkp3 = await db.genProof({
      json: people[0],
      col_id,
      path: "age",
      id: "Bob",
      query: ["$gt", 3],
    })

    expect(
      await myru.qCond(
        [col_id, toIndex("Bob"), ...path("age")],
        zkp3.slice(13, 14),
        zkp3,
      ),
    ).to.eql(true)
  })
})
