import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import DB from "../sdk/src/db_tree.js"
import Prover from "../sdk/src/prover.js"
import { resolve } from "path"

describe("zkJSON", () => {
  it("should generate proofs", { timeout: Infinity }, async () => {
    const db = new DB({
      wasm: resolve(
        import.meta.dirname,
        "../circom/build/circuits/db/index_js/index.wasm",
      ),
      zkey: resolve(
        import.meta.dirname,
        "../circom/build/circuits/db/index_0001.zkey",
      ),
    })
    await db.init()
    const col_id = await db.addCollection()
    await db.insert(col_id, "bob", { name: "Bob" })
    const inputs = await db.getInputs({
      json: { name: "Bob" },
      col_id: 0,
      path: "name",
      id: "bob",
    })
    const prover = new Prover({
      wasm: resolve(
        import.meta.dirname,
        "../circom/build/circuits/db/index_js/index.wasm",
      ),
      zkey: resolve(
        import.meta.dirname,
        "../circom/build/circuits/db/index_0001.zkey",
      ),
    })
    assert.equal((await prover.genProof(inputs))[8], "1")
  })

  it("should generate proofs2", { timeout: Infinity }, async () => {
    const _kv = () => {
      let store = {}
      return key => ({
        get: k => store[`${key}/${k}`],
        put: async (k, v) => void (store[`${key}/${k}`] = v),
        del: async k => void delete store[`${key}/${k}`],
      })
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

    const db3 = new DB({
      kv,
    })
    await db3.init()
    const hash3 = db3.hash()
    assert.equal(hash3, hash2_2)

    const inputs = await db3.getInputs({
      json: { abc: 1 },
      col_id: 1,
      path: "abc",
      id: "abc-1",
    })
    const prover = new Prover({
      wasm: resolve(
        import.meta.dirname,
        "../circom/build/circuits/db/index_js/index.wasm",
      ),
      zkey: resolve(
        import.meta.dirname,
        "../circom/build/circuits/db/index_0001.zkey",
      ),
    })
    assert.equal((await prover.genProof(inputs))[8], "1")
  })
})
