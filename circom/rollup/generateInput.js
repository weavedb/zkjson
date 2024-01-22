const gen = require("./gen")

const { writeFileSync } = require("fs")
const { resolve } = require("path")

const main = async () => {
  const { inputs } = await gen({})
  writeFileSync(resolve(__dirname, "input.json"), JSON.stringify(inputs))
}

main()
