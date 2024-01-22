const { DB } = require("../../sdk")

const _json = { a: 5 }
const _path = "a"
const _val = _json[_path]

const gen = async ({ size = 5, size_json = 256, level = 32 }) => {
  const db = new DB({ size, size_json, level })
  await db.init()
  await db.addCollection("colA")
  await db.insert("colA", "docA", _json)
  await db.insert("colA", "docB", { b: 2 })
  return {
    inputs: await db.getInputs({
      col_id: "colA",
      id: "docA",
      json: _json,
      path: _path,
      val: _val,
    }),
  }
}

module.exports = gen
