import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import DB from "../sdk/src/db_tree.js"
describe("zkJSON", () => {
  it("should generate proofs", { timeout: Infinity }, async () => {
    const _kv = () => {
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
    const kv = _kv()
    const db = new DB({ kv })
    await db.init()
    for (let i = 0; i < 10; i++) {
      await db.addCollection(i)
      await db.insert(i, `abc-${i}`, { abc: i })
    }
    const hash = db.hash()
    const db2 = new DB({ kv })
    await db2.init()
    const hash2 = db2.hash()
    assert.equal(hash, hash2)
    for (let i = 10; i < 20; i++) {
      await db2.insert(i - 10, `abc-${i}`, { abc: i })
    }
    const hash2_2 = db2.hash()

    const db3 = new DB({ kv })
    await db3.init()
    const hash3 = db3.hash()
    assert.equal(hash3, hash2_2)
  })
})
