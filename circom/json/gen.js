const { Doc } = require("../../sdk")

const gen = async ({ size = 5, size_json = 256 }) => {
  const doc = new Doc({ size, size_json })
  return {
    inputs: await doc.getInputs({
      json: { a: 1.234, b: 5.5, c: [1, 2, [3, 4, { a: 3 }]] },
      path: "c[2][2].a",
      val: 3,
    }),
  }
}

module.exports = gen
