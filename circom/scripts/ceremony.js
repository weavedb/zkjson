import { spawn } from "node:child_process"
import { existsSync, mkdirSync } from "fs"
import { resolve } from "path"
import { v4 as uuidv4 } from "uuid"
import yargs from "yargs"

let {
  power,
  entropy = uuidv4(),
  name,
} = yargs(process.argv.slice(2)).options({
  entropy: { type: "string" },
  power: { type: "number", demandOption: true },
  name: { type: "string" },
}).argv

if (typeof name === "undefined") name = "first contribution"

const main = async () => {
  const build = resolve(import.meta.dirname, "../build")
  const ptau = resolve(import.meta.dirname, "../build/ptau")
  const ptau_n = resolve(import.meta.dirname, "../build/ptau", power.toString())
  for (const v of [build, ptau, ptau_n]) if (!existsSync(v)) mkdirSync(v)

  const ceremony = resolve(import.meta.dirname, "./ceremony.sh")
  const ls = spawn("sh", [ceremony, power, name, entropy])

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
