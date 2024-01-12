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
const _path = "a"
const _val = _json[_path]

const level = 40
const size = 5
const size_json = 16
const json = pad(val2str(encode(_json)), size_json)
const path = pad(val2str(encodePath(_path)), size)
const val = pad(val2str(encodeVal(_val)), size)

const main = async () => {
  const db = new DB()

  const doc = val2str(encode(_val))
  await db.init()
  await db.addCollection("colA")
  await db.insert("colA", "docA", _json)
  await db.insert("colA", "docB", { b: 2 })
  await db.insert("colA", "docC", { c: 3 })
  await db.insert("colA", "docD", { c: 4 })

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
  let siblings = res.siblings
  for (let i = 0; i < siblings.length; i++)
    siblings[i] = col.tree.F.toObject(siblings[i])
  while (siblings.length < level) siblings.push(0)
  siblings = siblings.map(s => s.toString())
  const key = str2id("docA")
  const value = val2str(encode(_json))
  const write = {
    path,
    val,
    json,
    root,
    siblings,
    key,
    col_key,
    col_siblings,
    col_root,
  }
  console.log(write)
  writeFileSync(resolve(__dirname, "input.json"), JSON.stringify(write))
}

main()
