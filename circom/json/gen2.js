const { Doc } = require("../../sdk")

const gen2 = async ({ size_val = 5, size_path = 5, size_json = 256 }) => {
  const doc = new Doc({ size_val, size_path, size_json })
  return {
    inputs: await doc.getInputs({
      json: { a: false },
      path: "a",
      query: ["$lt", true],
    }),
  }
}

module.exports = gen2
