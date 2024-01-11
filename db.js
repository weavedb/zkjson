const newMemEmptyTrie = require("./circomlibjs").newMemEmptyTrie
const { str2val, val2str, id2str, encode, str2id } = require("./encoder")
const Collection = require("./collection")

class DB {
  constructor(size = 16) {
    this.size = size
  }
  async init() {
    this.tree = await newMemEmptyTrie()
    this.cols = {}
  }
  async addCollection(_key) {
    const id = str2id(_key)
    const col = await this.tree.find(id)
    if (col.found) throw Error("collection exists")
    const _col = new Collection(this.size)
    await _col.init()
    this.cols[_key] = _col
    const root = _col.tree.F.toObject(_col.tree.root).toString()
    await this.tree.insert(id, [root])
  }
  getColTree(col) {
    const _col = this.cols[col]
    if (!_col) throw Error("collection doesn't exist")
    return _col
  }
  async insert(col, _key, _val) {
    const _col = this.getColTree(col)
    const res_doc = await _col.insert(_key, _val)
    const res_col = await this.updateDB(_col, col)
    return { doc: res_doc, col: res_col, tree: _col.tree }
  }
  async updateDB(_col, col) {
    const root = _col.tree.F.toObject(_col.tree.root).toString()
    const colD = str2id(col)
    return await this.tree.update(colD, [root])
  }
  async update(col, _key, _val) {
    const _col = this.getColTree(col)
    const res_doc = await _col.update(_key, _val)
    const res_col = await this.updateDB(_col, col)
    return { doc: res_doc, col: res_col, tree: _col.tree }
  }

  async delete(col, _key) {
    const _col = this.getColTree(col)
    const res_doc = await _col.delete(_key)
    const res_col = await this.updateDB(_col, col)
    return { doc: res_doc, col: res_col, tree: _col.tree }
  }

  async get(col, _key) {
    const _col = this.getColTree(col)
    return await _col.get(_key)
  }
  async getCol(_key) {
    const id = str2id(_key)
    return await this.tree.find(id)
  }
}

module.exports = DB
