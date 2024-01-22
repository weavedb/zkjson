const { spawn } = require("node:child_process")
const { existsSync, mkdirSync } = require("fs")
const { resolve } = require("path")
const power = process.argv[2]
const entropy = process.argv[3]
let name = process.argv[4]

if (Number.isNaN(+power)) {
  console.log("power not a number")
  process.exit()
}

if (typeof name === "undefined") name = "first contribution"

if (typeof entropy === "undefined") {
  console.log("enter entropy")
  process.exit()
}

const main = async () => {
  const build = resolve(__dirname, "../build")
  const ptau = resolve(__dirname, "../build/ptau")
  const ptau_n = resolve(__dirname, "../build/ptau", power)
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
