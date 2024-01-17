const { writeFileSync } = require("fs")
const { resolve } = require("path")

const _json = { a: 5 }
const _path = "a"
const _val = _json[_path]
const { Collection } = require("../../sdk")

const main = async () => {
  const col = new Collection({ size: 5, size_json: 256, level: 100 })
  await col.init()
  await col.insert("docA", _json)
  await col.insert("docB", { b: 2 })
  await col.insert("docC", { c: 3 })
  await col.insert("docD", { c: 4 })
  const id = "docA"
  const inputs = await col.getInputs({
    json: _json,
    path: _path,
    val: _val,
    id,
  })
  writeFileSync(resolve(__dirname, "input.json"), JSON.stringify(inputs))
}

main()
