const newMemEmptyTrie = require("./circomlibjs").newMemEmptyTrie
const { pad, str2val, val2str, id2str, encode, str2id } = require("./encoder")

class Collection {
  constructor(size = 16) {
    this.size = size
  }
  async init() {
    this.tree = await newMemEmptyTrie()
  }
  async insert(_key, _val) {
    console.log(_key, _val)
    const doc = encode(_val)
    const id = str2id(_key)
    const val = pad(val2str(doc), this.size)
    return await this.tree.insert(id, val)
  }
  async update(_key, _val) {
    console.log(_key, _val)
    const doc = encode(_val)
    const id = str2id(_key)
    const val = pad(val2str(doc), this.size)
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
