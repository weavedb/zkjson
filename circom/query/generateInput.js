const { DB } = require("../../sdk")

const { writeFileSync } = require("fs")
const { resolve } = require("path")

const main = async () => {
  const db = new DB({ size: 5, size_json: 256, level: 100 })
  await db.init()
  await db.addCollection("colA")
  await db.addCollection("colB")
  await db.insert("colB", "docB", { b: 2 })
  await db.insert("colA", "docB", { b: 2 })
  await db.insert("colA", "docC", { c: 3 })
  await db.insert("colA", "docA", { c: 4 })
  const inputs = await db.getQueryInputs({
    col_id: "colA",
    id: "docA",
    json: { a: 5 },
  })
  writeFileSync(resolve(__dirname, "input.json"), JSON.stringify(inputs))
}

main()
