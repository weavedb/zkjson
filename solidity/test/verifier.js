const { resolve } = require("path")
const snarkjs = require("snarkjs")
const {
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
  str2id,
  val2str,
} = require("../../encoder")
const { buildPoseidon } = require("../../circomlibjs")
const DB = require("../../db")
const size = 100
const size_json = 1000
const _json = { a: 5 }
const json = pad(encode(_json), size_json)

const getInputs = (res, tree) => {
  const isOld0 = res.isOld0 ? "1" : "0"
  const oldRoot = tree.F.toObject(res.oldRoot).toString()
  const oldKey = res.isOld0 ? "0" : tree.F.toObject(res.oldKey).toString()
  const oldValue = res.isOld0 ? "0" : tree.F.toObject(res.oldValue).toString()
  let siblings = res.siblings
  for (let i = 0; i < siblings.length; i++)
    siblings[i] = tree.F.toObject(siblings[i])
  while (siblings.length < 30) siblings.push(0)
  siblings = siblings.map(s => s.toString())
  return { isOld0, oldRoot, oldKey, oldValue, siblings }
}

const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")

describe("zkDB", function () {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners()
    const Verifier = await ethers.getContractFactory("Groth16Verifier")
    const verifier = await Verifier.deploy()
    return { verifier, owner, otherAccount }
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const db = new DB()
      await db.init()
      await db.addCollection("colA")
      await db.insert("colA", "docB", { b: 2 })
      await db.insert("colA", "docC", { c: 3 })
      await db.insert("colA", "docD", { c: 4 })
      const {
        tree,
        col: res2,
        doc: res,
      } = await db.insert("colA", "docA", _json)

      const icol = getInputs(res, tree)
      const idb = getInputs(res2, db.tree)

      const newKey = str2id("docA")
      const value = val2str(encode(_json))

      const newKey_db = str2id("colA")
      const write = {
        oldRoot: icol.oldRoot,
        oldKey: icol.oldKey,
        oldValue: icol.oldValue,
        siblings: icol.siblings,
        isOld0: icol.isOld0,

        oldRoot_db: idb.oldRoot,
        oldKey_db: idb.oldKey,
        oldValue_db: idb.oldValue,
        siblings_db: idb.siblings,
        isOld0_db: idb.isOld0,

        newKey_db,
        newKey,
        value,
      }
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        write,
        resolve(__dirname, "../../circom/query/index_js/index.wasm"),
        resolve(__dirname, "../../circom/query/index_0001.zkey")
      )
      const { verifier } = await loadFixture(deployOneYearLockFixture)
      const valid = await verifier.verifyProof(
        [proof.pi_a[0], proof.pi_a[1]],
        [
          [proof.pi_b[0][1], proof.pi_b[0][0]],
          [proof.pi_b[1][1], proof.pi_b[1][0]],
        ],
        [proof.pi_c[0], proof.pi_c[1]],
        publicSignals
      )
      expect(valid).to.eql(true)
    })
  })
})
