import * as ffjavascript from "ffjavascript"
import buildPoseidon from "./buildPoseidon.js"
import { splitEvery } from "ramda"
export default class SMT {
  constructor(db, root, hash0, hash1, F) {
    this.db = db
    this.root = root
    this.hash0 = hash0
    this.hash1 = hash1
    this.F = F
  }

  _splitBits(_key) {
    const F = this.F
    const res = ffjavascript.Scalar.bits(F.toObject(_key))

    while (res.length < 256) res.push(false)

    return res
  }

  async update(_key, _newValue) {
    this.poseidon ??= await buildPoseidon()
    this.zero ??= this.poseidon([
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
    ])
    let _hash_value = _newValue
    if (_newValue.length === 256) {
      _hash_value = []
      for (let v of splitEvery(16, _newValue)) {
        const value =
          v.join("") === "0000000000000000" ? this.zero : this.poseidon(v)
        _hash_value.push(value)
      }
    }
    const newValue = this.poseidon(_hash_value)
    const F = this.F
    const key = F.e(_key)
    const resFind = await this.find(key)
    const res = {}
    res.oldRoot = this.root
    res.oldKey = key
    res.oldValue = resFind.foundValue
    res.newKey = key
    res.newValue = newValue
    res.siblings = resFind.siblings

    const ins = []
    const dels = []

    let rtOld = this.hash1(key, resFind.foundValue)
    let rtNew = this.hash1(key, newValue)
    ins.push([rtNew, [1, key, newValue]])
    dels.push(rtOld)

    const keyBits = this._splitBits(key)
    for (let level = resFind.siblings.length - 1; level >= 0; level--) {
      let oldNode, newNode
      const sibling = resFind.siblings[level]
      if (keyBits[level]) {
        oldNode = [sibling, rtOld]
        newNode = [sibling, rtNew]
      } else {
        oldNode = [rtOld, sibling]
        newNode = [rtNew, sibling]
      }
      rtOld = this.hash0(oldNode[0], oldNode[1])
      rtNew = this.hash0(newNode[0], newNode[1])
      dels.push(rtOld)
      ins.push([rtNew, newNode])
    }

    res.newRoot = rtNew

    await this.db.multiDel(dels)
    await this.db.multiIns(ins)
    await this.db.setRoot(rtNew)
    this.root = rtNew

    return res
  }

  async delete(_key) {
    const F = this.F
    const key = F.e(_key)

    const resFind = await this.find(key)
    if (!resFind.found) throw new Error("Key does not exists")

    const res = {
      siblings: [],
      delKey: key,
      delValue: resFind.foundValue,
    }

    const dels = []
    const ins = []
    let rtOld = this.hash1(key, resFind.foundValue)
    let rtNew
    dels.push(rtOld)

    let mixed
    if (resFind.siblings.length > 0) {
      const record = await this.db.get(
        resFind.siblings[resFind.siblings.length - 1],
      )
      if (record.length == 3 && F.eq(record[0], F.one)) {
        mixed = false
        res.oldKey = record[1]
        res.oldValue = record[2]
        res.isOld0 = false
        rtNew = resFind.siblings[resFind.siblings.length - 1]
      } else if (record.length == 2) {
        mixed = true
        res.oldKey = key
        res.oldValue = F.zero
        res.isOld0 = true
        rtNew = F.zero
      } else {
        throw new Error("Invalid node. Database corrupted")
      }
    } else {
      rtNew = F.zero
      res.oldKey = key
      res.oldValue = F.zero
      res.isOld0 = true
    }

    const keyBits = this._splitBits(key)

    for (let level = resFind.siblings.length - 1; level >= 0; level--) {
      let newSibling = resFind.siblings[level]
      if (level == resFind.siblings.length - 1 && !res.isOld0) {
        newSibling = F.zero
      }
      const oldSibling = resFind.siblings[level]
      if (keyBits[level]) {
        rtOld = this.hash0(oldSibling, rtOld)
      } else {
        rtOld = this.hash0(rtOld, oldSibling)
      }
      dels.push(rtOld)
      if (!F.isZero(newSibling)) {
        mixed = true
      }

      if (mixed) {
        res.siblings.unshift(resFind.siblings[level])
        let newNode
        if (keyBits[level]) {
          newNode = [newSibling, rtNew]
        } else {
          newNode = [rtNew, newSibling]
        }
        rtNew = this.hash0(newNode[0], newNode[1])
        ins.push([rtNew, newNode])
      }
    }

    await this.db.multiIns(ins)
    await this.db.setRoot(rtNew)
    this.root = rtNew
    await this.db.multiDel(dels)

    res.newRoot = rtNew
    res.oldRoot = rtOld

    return res
  }

  async insert(_key, _value) {
    this.poseidon ??= await buildPoseidon()
    this.zero ??= this.poseidon([
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
    ])
    let _hash_value = _value
    if (_value.length === 256) {
      _hash_value = []
      for (let v of splitEvery(16, _value)) {
        const value =
          v.join("") === "0000000000000000" ? this.zero : this.poseidon(v)
        _hash_value.push(value)
      }
    }

    const value = this.poseidon(_hash_value)
    const F = this.F
    const key = F.e(_key)
    let addedOne = false
    const res = {}
    res.oldRoot = this.root
    const newKeyBits = this._splitBits(key)

    let rtOld

    const resFind = await this.find(key)
    if (resFind.found) throw new Error("Key already exists")

    res.siblings = resFind.siblings
    let mixed

    if (!resFind.isOld0) {
      const oldKeyits = this._splitBits(resFind.notFoundKey)
      for (let i = res.siblings.length; oldKeyits[i] == newKeyBits[i]; i++) {
        res.siblings.push(F.zero)
      }
      rtOld = this.hash1(resFind.notFoundKey, resFind.notFoundValue)
      res.siblings.push(rtOld)
      addedOne = true
      mixed = false
    } else if (res.siblings.length > 0) {
      mixed = true
      rtOld = F.zero
    }

    const inserts = []
    const dels = []

    let rt = this.hash1(key, value)
    inserts.push([rt, [1, key, value]])

    for (let i = res.siblings.length - 1; i >= 0; i--) {
      if (i < res.siblings.length - 1 && !F.isZero(res.siblings[i])) {
        mixed = true
      }
      if (mixed) {
        const oldSibling = resFind.siblings[i]
        if (newKeyBits[i]) {
          rtOld = this.hash0(oldSibling, rtOld)
        } else {
          rtOld = this.hash0(rtOld, oldSibling)
        }
        dels.push(rtOld)
      }

      let newRt
      if (newKeyBits[i]) {
        newRt = this.hash0(res.siblings[i], rt)
        inserts.push([newRt, [res.siblings[i], rt]])
      } else {
        newRt = this.hash0(rt, res.siblings[i])
        inserts.push([newRt, [rt, res.siblings[i]]])
      }
      rt = newRt
    }

    if (addedOne) res.siblings.pop()
    while (
      res.siblings.length > 0 &&
      F.isZero(res.siblings[res.siblings.length - 1])
    ) {
      res.siblings.pop()
    }
    res.oldKey = resFind.notFoundKey
    res.oldValue = resFind.notFoundValue
    res.newRoot = rt
    res.isOld0 = resFind.isOld0

    await this.db.multiIns(inserts)
    await this.db.setRoot(rt)
    this.root = rt
    await this.db.multiDel(dels)

    return res
  }

  async find(_key) {
    const key = this.F.e(_key)
    const keyBits = this._splitBits(key)
    return await this._find(key, keyBits, this.root, 0)
  }

  async _find(key, keyBits, root, level) {
    const F = this.F
    if (typeof root === "undefined") root = this.root

    let res
    if (F.isZero(root)) {
      res = {
        found: false,
        siblings: [],
        notFoundKey: key,
        notFoundValue: F.zero,
        isOld0: true,
      }
      return res
    }

    const record = await this.db.get(root)

    if (record.length == 3 && F.eq(record[0], F.one)) {
      if (F.eq(record[1], key)) {
        res = {
          found: true,
          siblings: [],
          foundValue: record[2],
          isOld0: false,
        }
      } else {
        res = {
          found: false,
          siblings: [],
          notFoundKey: record[1],
          notFoundValue: record[2],
          isOld0: false,
        }
      }
    } else {
      if (keyBits[level] == 0) {
        res = await this._find(key, keyBits, record[0], level + 1)
        res.siblings.unshift(record[1])
      } else {
        res = await this._find(key, keyBits, record[1], level + 1)
        res.siblings.unshift(record[0])
      }
    }
    return res
  }
}
