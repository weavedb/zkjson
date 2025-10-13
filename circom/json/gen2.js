const { Doc, fromSignal } = require("../../sdk/src")

const gen2 = async ({
  size_val = 256,
  size_path = 256,
  size_json = 256,
  json,
  path,
  query,
}) => {
  const doc = new Doc({ size_val, size_path, size_json })
  return {
    inputs: await doc.getInputs({
      json: json ?? { c: [1, 2, 3, false], b: 3 },
      path: path ?? "c",
      query: query ?? ["$contains_none", [4, 5, 6, true]],
    }),
  }
}

module.exports = gen2
