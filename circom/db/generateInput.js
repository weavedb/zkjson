const { writeFileSync } = require("fs")
const { resolve } = require("path")
const gen = require("./gen")

const main = async () => {
  const { inputs } = await gen({})
  writeFileSync(resolve(__dirname, "input.json"), JSON.stringify(inputs))
}

main()
