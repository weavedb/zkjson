const newMemEmptyTrie = require("./circomlibjs").newMemEmptyTrie
const { str2val, val2str, id2str, encode, str2id } = require("./encoder")
const Collection = require("./collection")

class DB {
  constructor() {}
  async init() {
    this.tree = await newMemEmptyTrie()
    this.cols = {}
  }
  async addCollection(_key) {
    const id = str2id(_key)
    const col = await this.tree.find(id)
    if (col.found) throw Error("collection exists")
    const _col = new Collection()
    await _col.init()
    this.cols[_key] = _col
    const root = _col.tree.F.toObject(_col.tree.root).toString()
    await this.tree.insert(id, root)
  }
  getColTree(col) {
    const _col = this.cols[col]
    if (!_col) throw Error("collection doesn't exist")
    return _col
  }
  async insert(col, _key, _val) {
    const _col = this.getColTree(col)
    const id = str2id(_key)
    const doc = encode(_val)
    const val = val2str(doc)
    await _col.tree.insert(id, val)
    await this.updateDB(_col, col)
  }
  async updateDB(_col, col) {
    const root = _col.tree.F.toObject(_col.tree.root).toString()
    const colD = str2id(col)
    await this.tree.update(colD, root)
  }
  async update(col, _key, _val) {
    const _col = this.getColTree(col)
    const doc = encode(_val)
    const id = str2id(_key)
    const val = val2str(doc)
    await _col.tree.update(id, val)
    await this.updateDB(_col, col)
  }

  async delete(col, _key) {
    const _col = this.getColTree(col)
    const id = str2id(_key)
    await _col.tree.delete(id)
    await this.updateDB(_col, col)
  }

  async get(col, _key) {
    const _col = this.getColTree(col)
    const id = str2id(_key)
    return await _col.find(id)
  }
  async getCol(_key) {
    const id = str2id(_key)
    return await this.tree.find(id)
  }
}

module.exports = DB
