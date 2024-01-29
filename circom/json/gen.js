const { Doc } = require("../../sdk")

const gen = async ({ size_val = 5, size_path = 5, size_json = 256 }) => {
  const doc = new Doc({ size_val, size_path, size_json })
  return {
    inputs: await doc.getInputs({
      json: { a: 1.234, b: 5.5, c: [1, 2, [3, 4, { a: 3 }]] },
      path: "c[2][2].a",
    }),
  }
}

module.exports = gen
