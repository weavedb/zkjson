import newMemEmptyTrie from "./newMemEmptyTrie.js"
import { is, indexOf, isNil } from "ramda"
import Collection from "./collection_tree.js"

const to64 = hash => {
  const n = BigInt(hash)
  let hex = n.toString(16)
  if (hex.length % 2) hex = "0" + hex
  const buf = Buffer.from(hex, "hex")
  return buf.toString("base64")
}
const from64 = b64 => {
  const buf = Buffer.from(b64, "base64")
  const hex = buf.toString("hex")
  const n = BigInt("0x" + hex)
  return n.toString()
}

export default class DBTree {
  constructor({
    size_val = 256,
    size_path = 32,
    level = 184,
    size_json = 256,
    level_col = 24,
    kv,
  }) {
    this.kv = kv
    this.level_col = level_col
    this.size_val = size_val
    this.size_path = size_path
    this.level = level
    this.size_json = size_json
    this.count = 0
    this.ids = {}
    this.cols = []
  }

  async init() {
    this.kvi = this.kv?.("db")
    this.tree = await newMemEmptyTrie(this.kvi)
    if (this.kvi) {
      const count = this.kvi.get("count")
      if (!isNil(count)) this.count = count
    }
  }
  hash(format) {
    const _hash = this.tree.F.toObject(this.tree.root)
    if (format === "base64") return to64(_hash.toString())
    return _hash.toString()
  }
  async exists(num) {
    const ex = this.ids[num] || (await this.tree.find(num)).found
    if (ex) this.ids[num] = true
    return ex
  }
  async getID(num) {
    if (!isNil(num)) {
      if (await this.exists(num)) throw Error("id exists")
      return num
    } else {
      while (await this.exists(this.count)) this.count++
      return this.count
    }
  }
  async addCollection(num) {
    if (!isNil(num) && (!is(Number, num) || Math.round(num) !== num)) {
      throw Error("id is not an integer")
    }
    let id = null
    if (!isNil(num)) {
      if (this.cols[num]) throw Error("collection exists")
      const col = await this.tree.find(num)
      if (col.found) throw Error("collection exists")
      id = num
    } else {
      id = await this.getID(num)
    }
    const _col = await this.loadCol(id)
    const root = _col.tree.F.toObject(_col.tree.root).toString()
    await this.tree.insert(id, [root])
    if (id === this.count) {
      this.count++
      if (this.kvi) this.kvi.put("count", this.count)
    }
    return id
  }
  async getColTree(col) {
    const _col = this.cols[col]
    if (!_col) {
      return await this.loadCollection(col)
    } else return _col
  }
  async loadCol(id) {
    const col = new Collection({
      size_val: this.size_val,
      size_path: this.size_path,
      level: this.level,
      size_json: this.size_json,
      kv: this.kv?.(`dir_${id}`),
    })
    await col.init()
    this.cols[id] = col
    this.ids[id] = true
    return col
  }
  async loadCollection(id) {
    const hit = await this.tree.find(id)
    if (!hit || !hit.found) throw Error("collection doesn't exist")
    return await this.loadCol(id)
  }
  async insert(col, _key, _val) {
    const _col = await this.getColTree(col)
    let update = false
    let res_doc
    if ((await _col.get(_key)).found) {
      update = true
      res_doc = await _col.update(_key, _val)
    } else {
      res_doc = await _col.insert(_key, _val)
    }
    const res_col = await this.updateDB(_col, col)
    return { update, doc: res_doc, col: res_col, tree: _col.tree }
  }
  async updateDB(_col, col) {
    const root = _col.tree.F.toObject(_col.tree.root).toString()
    const colD = col
    return await this.tree.update(colD, [root])
  }
  async update(col, _key, _val) {
    const _col = await this.getColTree(col)
    const res_doc = await _col.update(_key, _val)
    const res_col = await this.updateDB(_col, col)
    return { doc: res_doc, col: res_col, tree: _col.tree }
  }

  async delete(col, _key) {
    const _col = await this.getColTree(col)
    const res_doc = await _col.delete(_key)
    const res_col = await this.updateDB(_col, col)
    return { doc: res_doc, col: res_col, tree: _col.tree }
  }

  async get(col, _key) {
    const _col = await this.getColTree(col)
    return await _col.get(_key)
  }
  async getCol(col) {
    return await this.tree.find(col)
  }
}
