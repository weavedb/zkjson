const newMemEmptyTrie = require("./circomlibjs").newMemEmptyTrie
const { range } = require("ramda")
const {
  pad,
  toSignal,
  str2val,
  val2str,
  id2str,
  encode,
  str2id,
} = require("./encoder")
const Collection = require("./collection")

class DB {
  constructor({ size = 5, level = 40, size_json = 16, size_txs = 10 }) {
    this.size = size
    this.level = level
    this.size_json = size_json
    this.size_txs = size_txs
  }

  async init() {
    this.tree = await newMemEmptyTrie()
    this.cols = {}
  }

  parse(res, tree) {
    const isOld0 = res.isOld0 ? "1" : "0"
    const oldRoot = tree.F.toObject(res.oldRoot).toString()
    const newRoot = tree.F.toObject(res.newRoot).toString()
    const oldKey = res.isOld0 ? "0" : tree.F.toObject(res.oldKey).toString()
    const oldValue = res.isOld0 ? "0" : tree.F.toObject(res.oldValue).toString()
    let siblings = res.siblings
    for (let i = 0; i < siblings.length; i++)
      siblings[i] = tree.F.toObject(siblings[i])
    while (siblings.length < this.level) siblings.push(0)
    siblings = siblings.map(s => s.toString())
    return { isOld0, oldRoot, oldKey, oldValue, siblings, newRoot }
  }

  async getRollupInputs({ queries }) {
    let write, _json
    let oldRoot = []
    let newRoot = []
    let oldKey = []
    let oldValue = []
    let siblings = []
    let isOld0 = []
    let oldRoot_db = []
    let newRoot_db = []
    let oldKey_db = []
    let oldValue_db = []
    let siblings_db = []
    let isOld0_db = []
    let newKey_db = []
    let newKey = []
    let _res
    let json = []
    let fnc = []
    for (let i = 0; i < this.size_txs; i++) {
      const v = queries[i]
      if (!v) {
        json.push(range(0, this.size_json).map(() => "0"))
        fnc.push([0, 0])
        newRoot.push(newRoot[i - 1])
        oldRoot.push("0")
        oldKey.push("0")
        oldValue.push("0")
        siblings.push(range(0, this.level).map(() => "0"))
        isOld0.push("0")
        oldRoot_db.push(newRoot_db[i - 1])
        oldKey_db.push("0")
        oldValue_db.push("0")
        siblings_db.push(range(0, this.level).map(() => "0"))
        isOld0_db.push("0")
        newKey_db.push("0")
        newKey.push("0")
        continue
      }
      _json = v[2]
      const { update, tree, col: res2, doc: res } = await this.insert(...v)
      const icol = this.parse(res, tree)
      const idb = this.parse(res2, this.tree)
      _res = idb
      const _newKey = str2id(v[1])
      json.push(pad(val2str(encode(_json)), this.size_json))
      const _newKey_db = str2id(v[0])
      fnc.push(update ? [0, 1] : [1, 0])
      newRoot.push(idb.newRoot)
      oldRoot.push(icol.oldRoot)
      oldKey.push(icol.oldKey)
      oldValue.push(icol.oldValue)
      siblings.push(icol.siblings)
      isOld0.push(icol.isOld0)
      oldRoot_db.push(idb.oldRoot)
      newRoot_db.push(idb.newRoot)
      oldKey_db.push(idb.oldKey)
      oldValue_db.push(idb.oldValue)
      siblings_db.push(idb.siblings)
      isOld0_db.push(idb.isOld0)
      newKey_db.push(_newKey_db)
      newKey.push(_newKey)
    }

    return {
      fnc,
      oldRoot,
      newRoot,
      oldKey,
      oldValue,
      siblings,
      isOld0,
      oldRoot_db,
      oldKey_db,
      oldValue_db,
      siblings_db,
      isOld0_db,
      newKey_db,
      newKey,
      json,
    }
  }

  async getQueryInputs({ id, col_id, json }) {
    const {
      update,
      tree,
      col: res2,
      doc: res,
    } = await this.insert(col_id, id, json)
    const icol = this.parse(res, tree)
    const idb = this.parse(res2, this.tree)
    const newKey = str2id(id)
    const newKey_db = str2id(col_id)
    return {
      fnc: update ? [0, 1] : [1, 0],
      oldRoot: icol.oldRoot,
      oldKey: icol.oldKey,
      oldValue: icol.oldValue,
      siblings: icol.siblings,
      isOld0: icol.isOld0,
      oldRoot_db: idb.oldRoot,
      oldKey_db: idb.oldKey,
      oldValue_db: idb.oldValue,
      siblings_db: idb.siblings,
      isOld0_db: idb.isOld0,
      newRoot: idb.newRoot,
      newKey_db,
      newKey,
      json: pad(toSignal(encode(json)), this.size_json),
    }
  }

  async getInputs({ id, col_id, json, path, val }) {
    const col_root = this.tree.F.toObject(this.tree.root).toString()
    const col_res = await this.getCol(id)

    let col_siblings = col_res.siblings
    for (let i = 0; i < col_siblings.length; i++)
      col_siblings[i] = this.tree.F.toObject(col_siblings[i])
    while (col_siblings.length < this.level) col_siblings.push(0)
    col_siblings = col_siblings.map(s => s.toString())
    const col_key = str2id(col_id)
    const col = this.getColTree(col_id)
    const col_inputs = await col.getInputs({ id, json, path, val })
    return {
      path: col_inputs.path,
      val: col_inputs.val,
      json: col_inputs.json,
      root: col_inputs.root,
      siblings: col_inputs.siblings,
      key: str2id(id),
      col_key,
      col_siblings,
      col_root,
    }
  }

  async addCollection(_key) {
    const id = str2id(_key)
    const col = await this.tree.find(id)
    if (col.found) throw Error("collection exists")
    const _col = new Collection({
      size: this.size,
      level: this.level,
      size_json: this.size_json,
    })
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
