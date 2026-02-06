import newMemEmptyTrie from "./newMemEmptyTrie.js"
import { groth16 } from "snarkjs"
import { is, indexOf, range, isNil } from "ramda"
import { pad, toSignal, encode, toIndex } from "./encoder.js"
import Collection from "./collection.js"

const to64 = hash => {
  const n = BigInt(hash)
  let hex = n.toString(16)
  if (hex.length % 2) hex = "0" + hex
  const buf = Buffer.from(hex, "hex")
  return buf.toString("base64")
}

export default class DB {
  constructor({
    size_val = 8,
    size_path = 4,
    level = 168,
    size_json = 256,
    size_txs = 10,
    level_col = 8,
    wasm,
    zkey,
    wasmRU,
    zkeyRU,
  }) {
    this.wasm = wasm
    this.zkey = zkey
    this.wasmRU = wasmRU
    this.zkeyRU = zkeyRU
    this.level_col = level_col
    this.size_val = size_val
    this.size_path = size_path
    this.level = level
    this.size_json = size_json
    this.size_txs = size_txs
    this.count = 0
    this.ids = []
  }

  async init() {
    this.tree = await newMemEmptyTrie()
    this.cols = []
  }

  parse(res, tree, level) {
    const isOld0 = res.isOld0 ? "1" : "0"
    const oldRoot = tree.F.toObject(res.oldRoot).toString()
    const newRoot = tree.F.toObject(res.newRoot).toString()
    const oldKey = res.isOld0 ? "0" : tree.F.toObject(res.oldKey).toString()
    const oldValue = res.isOld0 ? "0" : tree.F.toObject(res.oldValue).toString()
    let siblings = res.siblings
    for (let i = 0; i < siblings.length; i++)
      siblings[i] = tree.F.toObject(siblings[i])
    while (siblings.length < level) siblings.push(0)
    siblings = siblings.map(s => s.toString())
    return { isOld0, oldRoot, oldKey, oldValue, siblings, newRoot }
  }
  _getVal(j, p) {
    if (p.length === 0) {
      return j
    } else {
      const sp = p[0].split("[")
      for (let v of sp) {
        if (/]$/.test(v)) {
          j = j[v.replace(/]$/, "") * 1]
        } else {
          j = j[v]
        }
      }
      return this._getVal(j, p.slice(1))
    }
  }
  getVal(j, p) {
    if (p === "") return j
    return this._getVal(j, p.split("."))
  }

  async genProof({ json, col_id, path, id, query }) {
    const inputs = await this.getInputs({
      id,
      col_id,
      json,
      path,
      val: this.getVal(json, path),
      query,
    })
    const { proof, publicSignals } = await groth16.fullProve(
      inputs,
      this.wasm,
      this.zkey,
    )
    return [
      ...proof.pi_a.slice(0, 2),
      ...proof.pi_b[0].slice(0, 2).reverse(),
      ...proof.pi_b[1].slice(0, 2).reverse(),
      ...proof.pi_c.slice(0, 2),
      ...publicSignals,
    ]
  }

  async genRollupProof(txs) {
    const inputs = await this.getRollupInputs({ queries: txs })
    const { proof, publicSignals } = await groth16.fullProve(
      inputs,
      this.wasmRU,
      this.zkeyRU,
    )
    return [
      ...proof.pi_a.slice(0, 2),
      ...proof.pi_b[0].slice(0, 2).reverse(),
      ...proof.pi_b[1].slice(0, 2).reverse(),
      ...proof.pi_c.slice(0, 2),
      ...publicSignals,
    ]
  }

  async query(col_id, id, path, json) {
    const val = this.getVal(json, path)
    const inputs = await this.genProof({ col_id, id, json, path })
    const sigs = inputs.slice(8)
    const params = [[sigs[12], sigs[13], ...sigs.slice(1, 6)], inputs]
    let type =
      val === null
        ? 0
        : typeof val === "string"
          ? 3
          : typeof val === "boolean"
            ? 1
            : typeof val === "number"
              ? Number.isInteger(val)
                ? 2
                : 2.5
              : 4
    switch (type) {
      case 0:
        return await this.zkdb.qNull(...params)
      case 1:
        return await this.zkdb.qBool(...params)
      case 2:
        return (await this.zkdb.qInt(...params)).toString() * 1
      case 2.5:
        return (await this.zkdb.qFloat(...params)).map(n => n.toString() * 1)
      case 3:
        return await this.zkdb.qString(...params)
      case 4:
        return (await this.zkdb.qRaw(...params)).map(n => n.toString() * 1)
    }
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
        newRoot_db.push(newRoot_db[i - 1])
        oldKey_db.push("0")
        oldValue_db.push("0")
        siblings_db.push(range(0, this.level_col).map(() => "0"))
        isOld0_db.push("0")
        newKey_db.push("0")
        newKey.push("0")
        continue
      }
      _json = v[2]
      const { update, tree, col: res2, doc: res } = await this.insert(...v)
      const icol = this.parse(res, tree, this.level)
      const idb = this.parse(res2, this.tree, this.level_col)
      _res = idb
      const _newKey = toIndex(v[1])
      json.push(pad(toSignal(encode(_json)), this.size_json))
      const _newKey_db = v[0].toString()
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
    const icol = this.parse(res, tree, this.level)
    const idb = this.parse(res2, this.tree, this.level_col)
    const newKey = toIndex(id)
    const newKey_db = col_id.toString()
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

  async getInputs({ id, col_id, json, path, val, query }) {
    const col_root = this.tree.F.toObject(this.tree.root).toString()
    const col_res = await this.getCol(col_id)

    let col_siblings = col_res.siblings
    for (let i = 0; i < col_siblings.length; i++)
      col_siblings[i] = this.tree.F.toObject(col_siblings[i])
    while (col_siblings.length < this.level_col) col_siblings.push(0)
    col_siblings = col_siblings.map(s => s.toString())
    const col_key = col_id
    const col = this.getColTree(col_id)
    const col_inputs = await col.getInputs({ id, json, path, val, query })
    return {
      path: col_inputs.path,
      val: col_inputs.val,
      json: col_inputs.json,
      root: col_inputs.root,
      siblings: col_inputs.siblings,
      key: toIndex(id),
      col_key,
      col_siblings,
      col_root,
    }
  }
  hash(format) {
    const _hash = this.tree.F.toObject(this.tree.root)
    if (format === "base64") return to64(_hash.toString())
    return _hash.toString()
  }

  getID(num) {
    if (!isNil(num)) {
      if (indexOf(num)(this.ids) !== -1) {
        throw Error("id exists")
      }
      return num
    } else {
      while (indexOf(this.count)(this.ids) !== -1) {
        this.count++
      }
      return this.count++
    }
  }
  async addCollection(num) {
    if (!isNil(num) && (!is(Number, num) || Math.round(num) !== num)) {
      throw Error("id is not an integer")
    }
    const id = this.getID(num)
    const col = await this.tree.find(id)
    if (col.found) throw Error("collection exists")
    const _col = new Collection({
      size_val: this.size_val,
      size_path: this.size_path,
      level: this.level,
      size_json: this.size_json,
    })
    await _col.init()
    this.cols[id] = _col
    const root = _col.tree.F.toObject(_col.tree.root).toString()
    await this.tree.insert(id, [root])
    return id
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
    const colD = col
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
  async getCol(col) {
    return await this.tree.find(col)
  }
}
