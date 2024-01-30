const { Doc, fromSignal } = require("../../sdk")

const gen2 = async ({ size_val = 5, size_path = 5, size_json = 256 }) => {
  const doc = new Doc({ size_val, size_path, size_json })
  return {
    inputs: await doc.getInputs({
      json: { c: [1, 2, 3], b: 3 },
      path: "c",
      query: ["$contains_any", [0, 4, 1]],
    }),
  }
}

module.exports = gen2
