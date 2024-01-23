const newMemEmptyTrie = require("./circomlibjs").newMemEmptyTrie
const { pad, str2val, val2str, id2str, encode, str2id } = require("./encoder")
const Doc = require("./doc")

class Collection {
  constructor({ size_val = 5, size_path = 5, size_json = 16, level = 100 }) {
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
  async getInputs({ id, json, path, val }) {
    const doc_inputs = await this.doc.getInputs({ json, path, val })
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
      key: str2id(id),
    }
  }
  async init() {
    this.tree = await newMemEmptyTrie()
  }
  async insert(_key, _val) {
    const doc = encode(_val)
    const id = str2id(_key)
    const val = pad(val2str(doc), this.size_json)
    return await this.tree.insert(id, val)
  }
  async update(_key, _val) {
    const doc = encode(_val)
    const id = str2id(_key)
    const val = pad(val2str(doc), this.size_json)
    return await this.tree.update(id, val)
  }

  async delete(_key) {
    const id = str2id(_key)
    return await this.tree.delete(id)
  }

  async get(_key) {
    const id = str2id(_key)
    return await this.tree.find(id)
  }
}

module.exports = Collection
