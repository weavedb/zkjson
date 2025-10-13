import newMemEmptyTrie from "./newMemEmptyTrie.js"
import { pad, toSignal, encode, toIndex } from "./encoder.js"
import Doc from "./doc_tree.js"

export default class CollectionTree {
  constructor({
    size_json = 256,
    size_val = 256,
    size_path = 32,
    level = 184,
    kv,
  }) {
    this.kv = kv
    this.level = level
    this.doc = new Doc({
      size_val: (this.size_val = size_val),
      size_path: (this.size_path = size_path),
      size_json: (this.size_json = size_json),
    })
  }

  async init() {
    this.tree = await newMemEmptyTrie(this.kv)
  }

  async insert(_key, _val) {
    return await this.tree.insert(
      toIndex(_key),
      pad(toSignal(encode(_val)), this.size_json),
    )
  }

  async update(_key, _val) {
    return await this.tree.update(
      toIndex(_key),
      pad(toSignal(encode(_val)), this.size_json),
    )
  }

  async delete(_key) {
    return await this.tree.delete(toIndex(_key))
  }

  async get(_key) {
    return await this.tree.find(toIndex(_key))
  }

  async getInputs({ id, json, path, val, query }) {
    const doc_inputs = await this.doc.getInputs({ json, path, val, query })
    const res = await this.get(id)
    let siblings = res.siblings
    for (let i = 0; i < siblings.length; i++)
      siblings[i] = this.tree.F.toObject(siblings[i])
    while (siblings.length < this.level) siblings.push(0)
    siblings = siblings.map(s => s.toString())
    return {
      json: doc_inputs.json,
      path: doc_inputs.path,
      val: doc_inputs.val,
      root: this.tree.F.toObject(this.tree.root).toString(),
      siblings,
      key: toIndex(id),
    }
  }
}
