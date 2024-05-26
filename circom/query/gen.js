const { DB } = require("../../sdk")

const gen = async ({
  size_val = 256,
  size_path = 256,
  size_json = 256,
  level = 168,
  level_col = 8,
}) => {
  const db = new DB({ size_val, size_path, size_json, level, level_col })
  await db.init()
  const col1 = await db.addCollection()
  const col2 = await db.addCollection()
  await db.insert(col2, "docB", { b: 2 })
  await db.insert(col1, "docB", { b: 2 })
  await db.insert(col1, "docC", { c: 3 })
  await db.insert(col1, "docA", { c: 4 })
  return {
    db,
    inputs: await db.getQueryInputs({
      col_id: col1,
      id: "docA",
      json: { a: 5 },
    }),
  }
}

module.exports = gen
