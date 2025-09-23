import { spawn } from "node:child_process"
import { writeFileSync, existsSync, mkdirSync } from "fs"
import { resolve } from "path"
import { v4 as uuidv4 } from "uuid"
import yargs from "yargs"
let {
  power,
  entropy = uuidv4(),
  circuit,
  size_val = 8,
  size_path = 4,
  size_json = 256,
  level = 168,
  level_col = 8,
  size_txs = 10,
  nBlocks = 10,
  name,
} = yargs(process.argv.slice(2)).options({
  size: { type: "number" },
  size_json: { type: "number" },
  size_path: { type: "number" },
  level: { type: "number" },
  level_col: { type: "number" },
  size_txs: { type: "number" },
  name: { type: "string" },
  entropy: { type: "string" },
  power: { type: "number", demandOption: true },
  circuit: {
    type: "string",
    demandOption: true,
    choices: ["json", "collection", "db", "query", "rollup", "ipfs"],
  },
}).argv

if (typeof name === "undefined") name = "zkJSON"
const main = async () => {
  const build = resolve(import.meta.dirname, "../build")
  const ptau = resolve(import.meta.dirname, "../build/ptau")
  const ptau_n = resolve(import.meta.dirname, "../build/ptau", power.toString())
  const circuits = resolve(import.meta.dirname, "../build/circuits")
  const circuits_x = resolve(import.meta.dirname, "../build/circuits", circuit)
  const index = resolve(
    import.meta.dirname,
    "../build/circuits",
    circuit,
    "index.circom",
  )
  const input = resolve(
    import.meta.dirname,
    "../build/circuits",
    circuit,
    "input.json",
  )

  for (const v of [build, ptau, ptau_n])
    if (!existsSync(v)) {
      console.log("power of tau missing")
      process.exit()
    }
  for (const v of [circuits, circuits_x]) if (!existsSync(v)) mkdirSync(v)

  let script = ""
  if (circuit === "ipfs") {
    script = `pragma circom 2.1.5;
include "../../../ipfs/ipfs.circom";

component main {public [path, val]} = IPFS(${size_json}, ${size_path}, ${size_val}, ${nBlocks});`
  } else if (circuit === "json") {
    script = `pragma circom 2.1.5;
include "../../../json/json.circom";

component main {public [path, val]} = JSON(${size_json}, ${size_path}, ${size_val});`
  } else if (circuit === "collection") {
    script = `pragma circom 2.1.5;
include "../../../collection/collection.circom";

component main {public [key, path, val]} = Collection(${level}, ${size_json}, ${size_path}, ${size_val});`
    console.log(script)
  } else if (circuit === "db") {
    script = `pragma circom 2.1.5;
include "../../../db/db.circom";

component main {public [col_key, key, path, val, col_root]} = DB(${level_col}, ${level}, ${size_json}, ${size_path}, ${size_val});`
  } else if (circuit === "query") {
    script = `pragma circom 2.1.5;
include "../../../query/query.circom";

component main {public [oldRoot]} = Query(${level_col}, ${level}, ${size_json});`
  } else if (circuit === "rollup") {
    script = `pragma circom 2.1.5;
include "../../../rollup/rollup.circom";

component main {public [oldRoot]} = Rollup(${size_txs}, ${level_col}, ${level}, ${size_json});`
  }
  writeFileSync(index, script)

  const gen = require(`../${circuit}/gen`)
  const { inputs } = await gen({
    size_json,
    size_val,
    size_path,
    level,
    size_txs,
    level_col,
  })

  writeFileSync(input, JSON.stringify(inputs))

  const compile = resolve(import.meta.dirname, "./compile.sh")
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
