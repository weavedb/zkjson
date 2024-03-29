const { Doc } = require("../../sdk")
const { writeFileSync } = require("fs")
const { resolve } = require("path")
const gen = require("./gen")

let {
  input = resolve(__dirname, "input.json"),
  size_val = 5,
  size_path = 5,
  size_json = 256,
} = require("yargs")(process.argv.slice(2)).options({
  size: { type: "number" },
  size_json: { type: "number" },
}).argv

const main = async () => {
  const { inputs } = await gen({ size_json, size_val, size_path })
  writeFileSync(input, JSON.stringify(inputs))
}
main()
