import newMemEmptyTrie from "./newMemEmptyTrie.js"
import { pad, toSignal, encode, toIndex } from "./encoder.js"

export default class CollectionTree {
  constructor({
    size_val = 256,
    size_path = 32,
    size_json = 256,
    level = 184,
    kv,
  }) {
    this.kv = kv
    this.size_val = size_val
    this.size_path = size_path
    this.size_json = size_json
    this.level = level
  }
  async init() {
    this.tree = await newMemEmptyTrie(this.kv)
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
