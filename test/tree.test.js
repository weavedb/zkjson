import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import DB from "../sdk/src/db_tree.js"
describe("zkJSON", () => {
  it("should generate proofs", { timeout: Infinity }, async () => {
    const kv = () => {
      let store = {}
      return key => {
        return {
          get: k => store[`${key}/${k}`],
          put: (k, v) => {
            store[`${key}/${k}`] = v
          },
          del: k => delete store[`${key}/${k}`],
        }
      }
    }
    const db = new DB({ kv: kv() })
    await db.init()
    await db.addCollection(0)
    await db.insert(0, "abc", { abc: 1 })
    const hash = db.tree.F.toObject(db.tree.root).toString()
    assert.equal(
      hash,
      "19278090012522761828486775168079072378391061934430030739492575226545604210071",
    )
  })
})
