const { spawn } = require("node:child_process")
const { existsSync, mkdirSync } = require("fs")
const { resolve } = require("path")

let { power, entropy, name } = require("yargs")(process.argv.slice(2)).options({
  entropy: { type: "string", demandOption: true },
  power: { type: "number", demandOption: true },
  name: { type: "string" },
}).argv

if (typeof name === "undefined") name = "first contribution"

const main = async () => {
  const build = resolve(__dirname, "../build")
  const ptau = resolve(__dirname, "../build/ptau")
  const ptau_n = resolve(__dirname, "../build/ptau", power.toString())
  for (const v of [build, ptau, ptau_n]) if (!existsSync(v)) mkdirSync(v)

  const ceremony = resolve(__dirname, "./ceremony.sh")
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
