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
const level = 30

const getInputs = (res, tree) => {
  const isOld0 = res.isOld0 ? "1" : "0"
  const oldRoot = tree.F.toObject(res.oldRoot).toString()
  const newRoot = tree.F.toObject(res.newRoot).toString()
  const oldKey = res.isOld0 ? "0" : tree.F.toObject(res.oldKey).toString()
  const oldValue = res.isOld0 ? "0" : tree.F.toObject(res.oldValue).toString()
  let siblings = res.siblings
  for (let i = 0; i < siblings.length; i++)
    siblings[i] = tree.F.toObject(siblings[i])
  while (siblings.length < level) siblings.push(0)
  siblings = siblings.map(s => s.toString())
  return { isOld0, oldRoot, oldKey, oldValue, siblings, newRoot }
}
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers")

const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")

describe("zkDB", function () {
  this.timeout(1000000000)

  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners()
    const VerifierDB = await ethers.getContractFactory("Groth16VerifierDB")
    const verifierDB = await VerifierDB.deploy()
    const Verifier = await ethers.getContractFactory("Groth16Verifier")
    const verifier = await Verifier.deploy()
    const ZKDB = await ethers.getContractFactory("ZKDB")
    const zkdb = await ZKDB.deploy(verifier.address, verifierDB.address)
    return { verifierDB, verifier, owner, otherAccount, zkdb }
  }

  it("Should verify rollup transactions", async function () {
    const db = new DB()
    await db.init()
    await db.addCollection("colA")
    await db.insert("colA", "docB", { b: 2 })
    await db.insert("colA", "docC", { c: 3 })
    let txs = [
      ["colA", "docD", { c: 4 }],
      ["colA", "docA", { a: -5 }],
    ]

    let write, _json
    let oldRoot = []
    let newRoot = []
    let oldKey = []
    let oldValue = []
    let siblings = []
    let isOld0 = []
    let oldRoot_db = []
    let oldKey_db = []
    let oldValue_db = []
    let siblings_db = []
    let isOld0_db = []
    let newKey_db = []
    let newKey = []
    let value = []
    let _res

    for (let v of txs) {
      _json = v[2]
      const { tree, col: res2, doc: res } = await db.insert(...v)
      const icol = getInputs(res, tree)
      const idb = getInputs(res2, db.tree)
      _res = idb
      const _newKey = str2id(v[1])
      const _value = val2str(encode(_json))
      const _newKey_db = str2id(v[0])
      newRoot.push(idb.newRoot)
      oldRoot.push(icol.oldRoot)
      oldKey.push(icol.oldKey)
      oldValue.push(icol.oldValue)
      siblings.push(icol.siblings)
      isOld0.push(icol.isOld0)
      oldRoot_db.push(idb.oldRoot)
      oldKey_db.push(idb.oldKey)
      oldValue_db.push(idb.oldValue)
      siblings_db.push(idb.siblings)
      isOld0_db.push(idb.isOld0)
      newKey_db.push(_newKey_db)
      newKey.push(_newKey)
      value.push(_value)
    }

    write = {
      oldRoot,
      newRoot,
      oldKey,
      oldValue,
      siblings,
      isOld0,
      oldRoot_db,
      oldKey_db,
      oldValue_db,
      siblings_db,
      isOld0_db,
      newKey_db,
      newKey,
      value,
    }

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      write,
      resolve(__dirname, "../../circom/rollup/index_js/index.wasm"),
      resolve(__dirname, "../../circom/rollup/index_0001.zkey")
    )
    const { zkdb, verifier, verifierDB } = await loadFixture(deploy)

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

    // verify value
    const col_root = db.tree.F.toObject(db.tree.root).toString()
    const col_res = await db.getCol("docA")

    let col_siblings = col_res.siblings
    for (let i = 0; i < col_siblings.length; i++)
      col_siblings[i] = db.tree.F.toObject(col_siblings[i])
    while (col_siblings.length < level) col_siblings.push(0)
    col_siblings = col_siblings.map(s => s.toString())
    const col_key = str2id("colA")

    const col = db.getColTree("colA")
    const root = col.tree.F.toObject(col.tree.root).toString()
    const res = await col.get("docA")
    let _siblings = res.siblings
    for (let i = 0; i < _siblings.length; i++)
      _siblings[i] = col.tree.F.toObject(_siblings[i])
    while (_siblings.length < level) _siblings.push(0)
    _siblings = _siblings.map(s => s.toString())
    const key = str2id("docA")
    const _value = val2str(encode(_json))
    const _path = "a"
    const _val = -5
    const path = pad(encodePath(_path), size)
    const __val = pad(encodeVal(_val), size)
    const _write = {
      value: _value,
      path,
      val: __val,
      root,
      siblings: _siblings,
      key,
      col_key,
      col_siblings,
      col_root,
    }
    const { proof: proof2, publicSignals: sigs } =
      await snarkjs.groth16.fullProve(
        _write,
        resolve(__dirname, "../../circom/db/index_js/index.wasm"),
        resolve(__dirname, "../../circom/db/index_0001.zkey")
      )
    const valid2 = await verifierDB.verifyProof(
      [proof2.pi_a[0], proof2.pi_a[1]],
      [
        [proof2.pi_b[0][1], proof2.pi_b[0][0]],
        [proof2.pi_b[1][1], proof2.pi_b[1][0]],
      ],
      [proof2.pi_c[0], proof2.pi_c[1]],
      sigs
    )
    expect(valid2).to.eql(true)
    const inputs = [
      ...proof2.pi_a.slice(0, 2),
      ...proof2.pi_b[0].slice(0, 2).reverse(),
      ...proof2.pi_b[1].slice(0, 2).reverse(),
      ...proof2.pi_c.slice(0, 2),
      ...sigs,
    ]
    const num =
      (
        await zkdb.query(sigs[201], sigs[202], sigs.slice(1, 101), inputs)
      ).toString() * 1
    expect(num).to.eql(-5)
  })
})
