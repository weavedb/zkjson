const { DB } = require("../../sdk/src")

const gen = async ({
  size_val = 256,
  size_path = 256,
  size_json = 256,
  level = 168,
  level_col = 8,
  size_txs = 10,
}) => {
  const db = new DB({
    size_val,
    size_path,
    size_json,
    level,
    size_txs,
    level_col,
  })
  await db.init()
  const col1 = await db.addCollection()
  const col2 = await db.addCollection()
  let queries = [
    [col2, "docA", { d: 4 }],
    [col2, "docC", { d: 4 }],
    [col2, "docD", { d: 4 }],
    [col1, "docD", { b: 4 }],
    [col1, "docA", { b: 5 }],
    [col2, "docA2", { d: 4 }],
    [col2, "docC2", { d: 4 }],
    [col2, "docD2", { d: 4 }],
    [col1, "docA2", { b: 4 }],
  ]
  return { db, inputs: await db.getRollupInputs({ queries }) }
}

module.exports = gen
