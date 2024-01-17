const { Doc } = require("../../sdk")
const { writeFileSync } = require("fs")
const { resolve } = require("path")

const main = async () => {
  const doc = new Doc({ size: 10, size_json: 100 })
  const inputs = await doc.getInputs({
    json: { a: 1.234, b: 5.5, c: [1, 2, [3, 4, { a: 3 }]] },
    path: "c[2][2].a",
    val: 3,
  })
  writeFileSync(resolve(__dirname, "input.json"), JSON.stringify(inputs))
}
main()
