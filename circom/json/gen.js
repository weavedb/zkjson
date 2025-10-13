const { Doc } = require("../../sdk/src")

const gen = async ({ size_val = 8, size_path = 4, size_json = 256 }) => {
  const doc = new Doc({ size_val, size_path, size_json })
  const json = {
    num: 1,
    float: 1.23,
    str: "string",
    bool: true,
    null: null,
    array: [1, 2, 3],
  }

  return {
    inputs: await doc.getInputs({
      json,
      path: "array",
    }),
  }
}

module.exports = gen
