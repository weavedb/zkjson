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
const _json = { a: 5 }

const size = 5
const size_json = 16
const json = pad(val2str(encode(_json)), size_json)
const level = 50
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
  await db.insert("colA", "docB", { b: 2 })
  await db.insert("colA", "docC", { c: 3 })
  await db.insert("colA", "docD", { c: 4 })

  const { tree, col: res2, doc: res } = await db.insert("colA", "docA", _json)

  const icol = getInputs(res, tree)
  const idb = getInputs(res2, db.tree)

  const newKey = str2id("docA")
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
    newRoot: idb.newRoot,
    newKey_db,
    newKey,
    json,
  }
  console.log(write)
  writeFileSync(resolve(__dirname, "input.json"), JSON.stringify(write))
}

main()
