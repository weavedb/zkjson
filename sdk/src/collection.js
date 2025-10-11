import newMemEmptyTrie from "./newMemEmptyTrie.js"
import { pad, toSignal, encode, toIndex } from "./encoder.js"
import Doc from "./doc.js"

export default class Collection {
  constructor({ size_val = 8, size_path = 4, size_json = 256, level = 168 }) {
    this.size_val = size_val
    this.size_path = size_path
    this.size_json = size_json
    this.level = level
    this.doc = new Doc({
      size_val: this.size_val,
      size_path: this.size_path,
      size_json: this.size_json,
    })
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
  async init() {
    this.tree = await newMemEmptyTrie()
  }
  async insert(_key, _val) {
    const doc = encode(_val)
    const id = toIndex(_key)
    const val = pad(toSignal(doc), this.size_json)
    return await this.tree.insert(id, val)
  }
  async update(_key, _val) {
    const doc = encode(_val)
    const id = toIndex(_key)
    const val = pad(toSignal(doc), this.size_json)
    return await this.tree.update(id, val)
  }

  async delete(_key) {
    const id = toIndex(_key)
    return await this.tree.delete(id)
  }

  async get(_key) {
    const id = toIndex(_key)
    return await this.tree.find(id)
  }
}
