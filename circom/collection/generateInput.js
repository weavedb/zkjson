const { writeFileSync } = require("fs")
const { resolve } = require("path")

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
const Collection = require("../../collection")
const _json = { a: 5 }
const _path = "a"
const _val = _json[_path]

const size = 5
const size_json = 16
const level = 100
const json = pad(val2str(encode(_json)), size_json)
const path = pad(val2str(encodePath(_path)), size)
const val = pad(val2str(encodeVal(_val)), size)

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
  while (siblings.length < level) siblings.push(0)
  siblings = siblings.map(s => s.toString())
  const key = str2id("docA")
  writeFileSync(
    resolve(__dirname, "input.json"),
    JSON.stringify({
      path,
      json,
      val,
      root,
      siblings,
      key,
    })
  )
}

main()
