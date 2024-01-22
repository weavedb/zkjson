const { DB } = require("../../sdk")

const gen = async ({
  size = 5,
  size_json = 256,
  level = 32,
  size_txs = 10,
}) => {
  const db = new DB({ size, size_json, level, size_txs })
  await db.init()
  await db.addCollection("colA")
  await db.addCollection("colB")
  let queries = [
    ["colB", "docA", { d: 4 }],
    ["colB", "docC", { d: 4 }],
    ["colB", "docD", { d: 4 }],
    ["colA", "docD", { b: 4 }],
    ["colA", "docA", { b: 5 }],
    ["colB", "docA2", { d: 4 }],
    ["colB", "docC2", { d: 4 }],
    ["colB", "docD2", { d: 4 }],
    ["colA", "docA2", { b: 4 }],
  ]
  return { inputs: await db.getRollupInputs({ queries }) }
}

module.exports = gen
