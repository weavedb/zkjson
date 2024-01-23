const snarkjs = require("snarkjs")
const { resolve } = require("path")
const { pad, toSignal, encode, encodePath, encodeVal } = require("./encoder")
const DB = require("./db")
const { range } = require("ramda")

module.exports = class Rollup {
  constructor({
    size_val = 5,
    size_path = 5,
    size_json = 256,
    level = 100,
    size_txs = 10,
    level_col = 8,
    wasm,
    zkey,
  }) {
    this.size_val = size_val
    this.size_path = size_path
    this.size_json = size_json
    this.size_txs = size_txs
    this.level = level
    this.level_col = level_col
    this.wasm = wasm
    this.zkey = zkey
  }
  async init() {
    this.db = new DB({
      level: this.level,
      size_path: this.size_path,
      size_val: this.size_val,
      size_json: this.size_json,
      size_txs: this.size_txs,
      level_col: this.level_col,
    })
    await this.db.init()
  }
  async getInputs(queries) {
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
      const _newKey = str2id(v[1])
      json.push(pad(val2str(encode(_json)), this.size_json))
      const _newKey_db = v[0]
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
  async genProof(queries) {
    const inputs = await this.getInputs(queries)
    console.log(inputs)
    return 3
  }
  async genProof2(col, doc, tar, path) {
    const val = this.getVal(tar, path)

    const col_root = this.db.tree.F.toObject(this.db.tree.root).toString()
    const col_res = await this.db.getCol(doc)

    let col_siblings = col_res.siblings
    for (let i = 0; i < col_siblings.length; i++)
      col_siblings[i] = this.db.tree.F.toObject(col_siblings[i])
    while (col_siblings.length < this.level_col) col_siblings.push(0)
    col_siblings = col_siblings.map(s => s.toString())
    const col_key = col

    const _col = this.db.getColTree(col)
    const root = _col.tree.F.toObject(_col.tree.root).toString()
    const res = await _col.get(doc)
    let _siblings = res.siblings
    for (let i = 0; i < _siblings.length; i++)
      _siblings[i] = _col.tree.F.toObject(_siblings[i])
    while (_siblings.length < this.level) _siblings.push(0)
    _siblings = _siblings.map(s => s.toString())
    const key = toIndex(doc)

    const _json = pad(toSignal(encode(tar)), this.size_json)
    const _path = pad(toSignal(encodePath(path)), this.size_path)
    const _val = pad(toSignal(encodeVal(val)), this.size)
    const _write = {
      json: _json,
      path: _path,
      val: _val,
      root,
      siblings: _siblings,
      key,
      col_key,
      col_siblings,
      col_root,
    }
    const { proof: proof2, publicSignals: sigs } =
      await snarkjs.groth16.fullProve(
        _write,
        resolve(
          __dirname,
          "../../circom/build/circuits/db/index_js/index.wasm"
        ),
        resolve(__dirname, "../../circom/build/circuits/db/index_0001.zkey")
      )
    return [
      ...proof2.pi_a.slice(0, 2),
      ...proof2.pi_b[0].slice(0, 2).reverse(),
      ...proof2.pi_b[1].slice(0, 2).reverse(),
      ...proof2.pi_c.slice(0, 2),
      ...sigs,
    ]
  }

  async getInputs2({ json, path }) {
    return {
      json: pad(toSignal(encode(json)), this.size_json),
      path: pad(toSignal(encodePath(path)), this.size_path),
      val: pad(toSignal(encodeVal(this.getVal(json, path))), this.size_val),
    }
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

  async genProof2(json, path) {
    const inputs = await this.getInputs(json, path)
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      this.wasm,
      this.zkey
    )
    return [
      ...proof.pi_a.slice(0, 2),
      ...proof.pi_b[0].slice(0, 2).reverse(),
      ...proof.pi_b[1].slice(0, 2).reverse(),
      ...proof.pi_c.slice(0, 2),
      ...publicSignals,
    ]
  }
}
