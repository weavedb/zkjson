const snarkjs = require("snarkjs")
const { resolve } = require("path")
const { range } = require("ramda")
const {
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
  str2id,
  toSignal,
} = require("../../sdk")

const getInputs = (res, tree, level) => {
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

module.exports = class ZKDB {
  constructor(db, zkdb, size, size_json, level, size_txs) {
    this.db = db
    this.zkdb = zkdb
    this.size = size
    this.size_json = size_json
    this.level = level
    this.size_txs = size_txs
  }
  async genProof(col, doc, tar, path) {
    const val = tar[path]
    const col_root = this.db.tree.F.toObject(this.db.tree.root).toString()
    const col_res = await this.db.getCol(doc)

    let col_siblings = col_res.siblings
    for (let i = 0; i < col_siblings.length; i++)
      col_siblings[i] = this.db.tree.F.toObject(col_siblings[i])
    while (col_siblings.length < this.level) col_siblings.push(0)
    col_siblings = col_siblings.map(s => s.toString())
    const col_key = str2id(col)

    const _col = this.db.getColTree(col)
    const root = _col.tree.F.toObject(_col.tree.root).toString()
    const res = await _col.get(doc)
    let _siblings = res.siblings
    for (let i = 0; i < _siblings.length; i++)
      _siblings[i] = _col.tree.F.toObject(_siblings[i])
    while (_siblings.length < this.level) _siblings.push(0)
    _siblings = _siblings.map(s => s.toString())
    const key = str2id(doc)

    const _json = pad(toSignal(encode(tar)), this.size_json)
    const _path = pad(toSignal(encodePath(path)), this.size)
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
        resolve(__dirname, "../../circom/db/index_js/index.wasm"),
        resolve(__dirname, "../../circom/db/index_0001.zkey")
      )
    return [
      ...proof2.pi_a.slice(0, 2),
      ...proof2.pi_b[0].slice(0, 2).reverse(),
      ...proof2.pi_b[1].slice(0, 2).reverse(),
      ...proof2.pi_c.slice(0, 2),
      ...sigs,
    ]
  }
  async query(col, doc, tar, path) {
    const val = tar[path]
    const inputs = await this.genProof(col, doc, tar, path)
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
  async insert(txs) {
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
    let json = []
    let fnc = []
    let _res
    for (let i = 0; i < this.size_txs; i++) {
      const v = txs[i]
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
      const { update, tree, col: res2, doc: res } = await this.db.insert(...v)
      const icol = getInputs(res, tree, this.level)
      const idb = getInputs(res2, this.db.tree, this.level)
      _res = idb
      const _newKey = str2id(v[1])
      const _value = pad(toSignal(encode(_json)), this.size_json)
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
      json.push(_value)
    }

    write = {
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
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      write,
      resolve(__dirname, "../../circom/rollup/index_js/index.wasm"),
      resolve(__dirname, "../../circom/rollup/index_0001.zkey")
    )
    const inputs2 = [
      ...proof.pi_a.slice(0, 2),
      ...proof.pi_b[0].slice(0, 2).reverse(),
      ...proof.pi_b[1].slice(0, 2).reverse(),
      ...proof.pi_c.slice(0, 2),
      ...publicSignals,
    ]
    return await this.zkdb?.commit(inputs2)
  }
}
