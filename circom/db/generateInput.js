const { DB } = require("../../sdk")

const { writeFileSync } = require("fs")
const { resolve } = require("path")
const _json = { a: 5 }
const _path = "a"
const _val = _json[_path]

const main = async () => {
  const db = new DB({ size: 5, size_json: 16, level: 40 })
  await db.init()
  await db.addCollection("colA")
  await db.insert("colA", "docA", _json)
  await db.insert("colA", "docB", { b: 2 })
  const inputs = await db.getInputs({
    col_id: "colA",
    id: "docA",
    json: _json,
    path: _path,
    val: _val,
  })
  writeFileSync(resolve(__dirname, "input.json"), JSON.stringify(inputs))
}

main()
