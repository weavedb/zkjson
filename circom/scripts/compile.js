const { spawn } = require("node:child_process")
const { writeFileSync, existsSync, mkdirSync } = require("fs")
const { resolve } = require("path")

let {
  power,
  entropy,
  circuit,
  size = 5,
  size_json = 256,
  level = 40,
  size_txs = 10,
  name,
} = require("yargs")(process.argv.slice(2)).options({
  name: { type: "string" },
  entropy: { type: "string", demandOption: true },
  power: { type: "number", demandOption: true },
  circuit: {
    type: "string",
    demandOption: true,
    choices: ["json", "collection", "db", "query", "rollup"],
  },
}).argv

if (typeof name === "undefined") name = "zkJSON"
const main = async () => {
  const build = resolve(__dirname, "../build")
  const ptau = resolve(__dirname, "../build/ptau")
  const ptau_n = resolve(__dirname, "../build/ptau", power.toString())
  const circuits = resolve(__dirname, "../build/circuits")
  const circuits_x = resolve(__dirname, "../build/circuits", circuit)
  const index = resolve(__dirname, "../build/circuits", circuit, "index.circom")
  const input = resolve(__dirname, "../build/circuits", circuit, "input.json")

  for (const v of [build, ptau, ptau_n])
    if (!existsSync(v)) {
      console.log("power of tau missing")
      process.exit()
    }
  for (const v of [circuits, circuits_x]) if (!existsSync(v)) mkdirSync(v)
  let script = ""
  if (circuit === "json") {
    script = `pragma circom 2.1.5;
include "../../../json/json.circom";

component main {public [path, val]} = JSON(${size_json}, ${size});`
  } else if (circuit === "collection") {
    script = `pragma circom 2.1.5;
include "../../../collection/collection.circom";

component main {public [key, path, val]} = Collection(${level}, ${size_json}, ${size});`
  } else if (circuit === "db") {
    script = `pragma circom 2.1.5;
include "../../../db/db.circom";

component main {public [col_key, key, path, val, col_root]} = DB(${level}, ${size_json}, ${size});`
  } else if (circuit === "db") {
    script = `pragma circom 2.1.5;
include "../../../db/db.circom";

component main {public [col_key, key, path, val, col_root]} = DB(${level}, ${size_json}, ${size});`
  } else if (circuit === "query") {
    script = `pragma circom 2.1.5;
include "../../../query/query.circom";

component main {public [oldRoot]} = Query(${level}, ${size_json}, ${size});`
  } else if (circuit === "rollup") {
    script = `pragma circom 2.1.5;
include "../../../rollup/rollup.circom";

component main {public [oldRoot]} = Rollup(${size_txs}, ${level}, ${size_json}, ${size});`
  }
  writeFileSync(index, script)

  const gen = require(`../${circuit}/gen`)
  const { inputs } = await gen({ size_json, size, level })
  writeFileSync(input, JSON.stringify(inputs))

  const compile = resolve(__dirname, "./compile.sh")
  const ls = spawn("sh", [compile, circuit, power, entropy, name])

  ls.stdout.on("data", data => console.log(`${data}`))

  ls.stderr.on("data", data => {
    console.error(`stderr: ${data}`)
    process.exit()
  })

  ls.on("close", code => {
    console.log(`child process exited with code ${code}`)
    process.exit()
  })
}
main()