const { DB } = require("../../sdk")

const _json = { a: 5 }
const _path = "a"
const _val = _json[_path]

const gen = async ({
  size_val = 5,
  size_path = 5,
  size_json = 256,
  level = 32,
  level_col = 8,
}) => {
  const db = new DB({ size_val, size_path, size_json, level, level_col })
  await db.init()
  const col_index = await db.addCollection()
  await db.insert(col_index, "docA", _json)
  await db.insert(col_index, "docB", { b: 2 })
  return {
    inputs: await db.getInputs({
      col_id: col_index,
      id: "docA",
      json: _json,
      path: _path,
      val: _val,
    }),
  }
}

module.exports = gen
