export default class SMTMemDb {
  constructor(F, kv) {
    this.kv = kv
    this.nodes = {}
    this.root = F.zero
    this.F = F
  }
  async init() {
    if (this.kv) {
      const root = this.kv.get("root")
      if (root) this.root = root
      else await this.kv.put("root", this.root)
    }
  }
  async getRoot() {
    return this.root
  }

  _key2str(k) {
    this.F
    const keyS = this.F.toString(k)
    return keyS
  }

  _normalize(n) {
    this.F
    for (let i = 0; i < n.length; i++) {
      n[i] = this.F.e(n[i])
    }
  }

  async get(key) {
    const keyS = this._key2str(key)
    if (!this.nodes[keyS]) {
      let node = this.kv.get(`node_${keyS}`)
      if (node) this.nodes[keyS] = node
    }
    return this.nodes[keyS]
  }

  async multiGet(keys) {
    const promises = []
    for (let i = 0; i < keys.length; i++) {
      promises.push(this.get(keys[i]))
    }
    return await Promise.all(promises)
  }

  async setRoot(rt) {
    this.root = rt
    if (this.kv) await this.kv.put("root", this.root)
  }

  async multiIns(inserts) {
    for (let i = 0; i < inserts.length; i++) {
      const keyS = this._key2str(inserts[i][0])
      this._normalize(inserts[i][1])
      this.nodes[keyS] = inserts[i][1]
      if (this.kv) await this.kv.put(`node_${keyS}`, this.nodes[keyS])
    }
  }

  async multiDel(dels) {
    for (let i = 0; i < dels.length; i++) {
      const keyS = this._key2str(dels[i])
      delete this.nodes[keyS]
      if (this.kv) await this.kv.del(`node_${keyS}`)
    }
  }
}
