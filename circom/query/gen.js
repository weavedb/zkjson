const { DB } = require("../../sdk")

const gen = async ({ size = 5, size_json = 256, level = 32 }) => {
  const db = new DB({ size, size_json, level })
  await db.init()
  await db.addCollection("colA")
  await db.addCollection("colB")
  await db.insert("colB", "docB", { b: 2 })
  await db.insert("colA", "docB", { b: 2 })
  await db.insert("colA", "docC", { c: 3 })
  await db.insert("colA", "docA", { c: 4 })
  return {
    db,
    inputs: await db.getQueryInputs({
      col_id: "colA",
      id: "docA",
      json: { a: 5 },
    }),
  }
}

module.exports = gen
