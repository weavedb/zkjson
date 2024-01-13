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

const { writeFileSync } = require("fs")
const { resolve } = require("path")

const size = 5
const size_json = 16
const level = 40
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

const main = async () => {
  const db = new DB()
  await db.init()
  await db.addCollection("colA")
  await db.addCollection("colB")
  let txs = [
    ["colB", "docA", { d: 4 }],
    ["colB", "docC", { d: 4 }],
    ["colB", "docD", { d: 4 }],
    ["colA", "docD", { b: 4 }],
    ["colA", "docA", { b: 5 }],
    ["colB", "docA2", { d: 4 }],
    ["colB", "docC2", { d: 4 }],
    ["colB", "docD2", { d: 4 }],
    ["colA", "docD2", { b: 4 }],
    ["colA", "docA2", { b: 5 }],
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
  let json = []
  let fnc = []

  for (let v of txs) {
    _json = v[2]
    const { update, tree, col: res2, doc: res } = await db.insert(...v)
    const icol = getInputs(res, tree)
    const idb = getInputs(res2, db.tree)
    const _newKey = str2id(v[1])
    const _value = pad(val2str(encode(_json)), size_json)
    const _newKey_db = str2id(v[0])
    fnc.push(update ? [0, 1] : [1, 0])
    oldRoot.push(icol.oldRoot)
    newRoot.push(idb.newRoot)
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
    json.push(_value)
  }

  write = {
    fnc,
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
    json,
  }
  console.log(write)
  writeFileSync(resolve(__dirname, "input.json"), JSON.stringify(write))
}

main()
