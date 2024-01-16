const { Doc } = require("../../sdk")
const { writeFileSync } = require("fs")
const { resolve } = require("path")

const main = async () => {
  const doc = new Doc({ size: 10, size_json: 100 })
  const inputs = await doc.getInputs({
    json: { a: 1.234, b: 5.5 },
    path: "b",
    val: 5.5,
  })

  writeFileSync(resolve(__dirname, "input.json"), JSON.stringify(inputs))
}
main()
