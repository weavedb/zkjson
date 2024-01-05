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
const Collection = require("../../collection")

const { writeFileSync } = require("fs")
const { resolve } = require("path")
const _json = JSON.parse(process.argv[2])
const _path = eval(process.argv[3])
const _val = eval(process.argv[4])

const size = 100
const size_json = 1000
const json = pad(encode(_json), size_json)
const path = pad(encodePath(_path), size)
const __val = pad(encodeVal(_val), size)

const main = async () => {
  const doc = val2str(encode(_val))
  const col = new Collection()
  await col.init()
  await col.insert("docA", _json)
  await col.insert("docB", { b: 2 })
  await col.insert("docC", { c: 3 })
  await col.insert("docD", { c: 4 })
  const root = col.tree.F.toObject(col.tree.root).toString()
  const res = await col.get("docA")
  let siblings = res.siblings
  for (let i = 0; i < siblings.length; i++)
    siblings[i] = col.tree.F.toObject(siblings[i])
  while (siblings.length < 50) siblings.push(0)
  siblings = siblings.map(s => s.toString())
  const key = str2id("docA")
  const value = val2str(encode(_json))
  writeFileSync(
    resolve(__dirname, "input.json"),
    JSON.stringify({
      value,
      path,
      val: __val,
      root,
      siblings,
      key,
    })
  )
}

main()
