const { bits, tobits } = require("./utils.js")

module.exports = class decoder {
  constructor() {
    this.c = 0
    this.json = null
  }
  n(len) {
    let result = 0
    for (let i = 0; i < len; i++) {
      const bitPos = this.c + i
      const byteIndex = Math.floor(bitPos / 8)
      const bitIndex = 7 - (bitPos % 8)
      const bit = (this.o[byteIndex] >> bitIndex) & 1
      result = (result << 1) | bit
    }
    this.c += len
    return result
  }
  lh128() {
    let n = 0
    let i = 0
    let len_len = null
    do {
      len_len = this.n(8)
      n += Math.pow(128, i) * (len_len >= 128 ? len_len - 128 : len_len)
      i++
    } while (len_len >= 128)
    return n
  }
  decode(v) {
    this.o = v
    this.c = 0
    this.nc = 0
    this.drefs = []
    this.vrefs = []
    this.keylens = []
    this.types = []
    this.nums = []
    this.keys = []
    this.indexes = []
    this.json = {}
    this.getLen()
    this.getDlinks()
    this.getKeyLens()
    this.getTypes()
    this.getNums()
    this.getIndexes()
    this.movePads()
    this.getKeys()
    this.build()
  }
  getLen() {
    this.len = this.short()
  }
  show() {
    console.log()
    console.log("len", this.len)
    console.log("drefs", this.drefs)
    console.log("vrefs", this.vrefs)
    console.log("keylens", this.keylens)
    console.log("types", this.types)
    console.log("nums", this.nums)
    console.log("indexes", this.indexes)
    console.log("keys", this.keys)
    console.log()
  }
  getDlinks() {
    let ind = 1
    let i = 0
    while (i < this.len) {
      const flag = this.n(1)
      const x = this.n(bits(ind + 1))
      if (x === 0) {
        const len = this.short()
        const val = this.uint()
        for (let i2 = 0; i2 < len; i2++) {
          if (flag === 0) this.drefs.push(val)
          else this.vrefs.push(val)
        }
        if (flag === 1) i += len
        else if (flag === 0) ind += len
      } else {
        if (flag === 0) this.drefs.push(x)
        else this.vrefs.push(x)
        if (flag === 1) i++
        else if (flag === 0) ind++
      }
    }
  }
  getKeyLens() {
    if (this.drefs.length === 0 && this.len === 0) return
    for (let i = 0; i < this.drefs.length + 1; i++) {
      const int = this.short()
      this.keylens.push(int)
    }
  }
  getIndexes() {
    for (const v of this.keylens) {
      if (v > 1) continue
      const int = this.short()
      this.indexes.push(int)
    }
  }

  getTypes() {
    let i2 = -1
    let len = Math.max(1, this.vrefs.length)
    for (let i = 0; i < len; i++) {
      let type = this.n(3)
      if (type === 0) {
        const count = this.short()
        i += count - 1
        let type2 = this.n(3)
        for (let i2 = 0; i2 < count; i2++) this.types.push(type2)
      } else this.types.push(type)
    }
  }
  short() {
    const x = this.n(2)
    return x === 3 ? this.lh128() : this.n(x === 2 ? 4 : x === 1 ? 3 : 2)
  }
  uint() {
    const x = this.n(2)
    return x === 3 ? this.lh128() : this.n(x === 2 ? 6 : x === 1 ? 4 : 3)
  }
  getNums() {
    for (let v of this.types) {
      if (v >= 4 && v <= 6) {
        const num = this.uint()
        if (v === 4) this.nums.push(num)
        else if (v === 5) this.nums.push(-num)
        else if (v === 6) {
          if (num === 0 || num === 4) {
            const moved = this.uint()
            const int = this.uint()
            const neg = num === 0 ? 1 : -1
            this.nums.push((int / Math.pow(10, moved - 1)) * neg)
          } else {
            const moved = num > 4 ? num - 4 : num
            const neg = num > 4 ? -1 : 1
            if (moved === 1) {
              this.nums.push(neg === -1 ? {} : [])
            } else {
              const int = this.uint()
              this.nums.push((int / Math.pow(10, moved - 1)) * neg)
            }
          }
        }
      }
    }
  }
  getKeys() {
    let ind = 0
    for (let i = 0; i < this.keylens.length; i++) {
      const len = this.keylens[i]
      if (len === 2) {
        this.keys.push("")
      } else if (len < 3) {
        this.keys.push(this.indexes[ind++])
        continue
      } else {
        let key = ""
        for (let i2 = 0; i2 < len - 2; i2++) {
          key += String.fromCharCode(Number(this.lh128()))
        }
        this.keys.push(key)
      }
    }
  }
  bits() {
    console.log(this.c, tobits(this.o, this.c))
  }
  movePads() {
    if (this.c % 8 > 0) this.c += 8 - (this.c % 8)
  }
  getKey(i, keys) {
    const k = this.keys[i - 1]
    if (typeof k === "number") keys.unshift([this.keylens[i - 1], k])
    else keys.unshift(k)
    if (i > 1) {
      const d = this.drefs[i - 2]
      if (d > 0) this.getKey(this.drefs[d - 1], keys)
    }
  }
  build() {
    const get = i => {
      const type = this.types[i]
      let val = null
      if (type === 7) {
        let len = this.lh128()
        val = ""
        for (let i2 = 0; i2 < len; i2++) {
          val += String.fromCharCode(Number(this.lh128()))
        }
      } else if (type === 4) val = this.nums[this.nc++]
      else if (type === 5) val = this.nums[this.nc++]
      else if (type === 6) val = this.nums[this.nc++]
      else if (type === 1) val = null
      else if (type === 2) val = true
      else if (type === 3) val = false
      return val
    }
    if (this.vrefs.length === 0) return (this.json = get(0))
    this.json = null
    let i = 0
    let init = [[], []]
    let type = key => (typeof key === "string" ? 2 : key[0])

    let set = k => (init[k[0]][k[1]] = true)
    let ex = k => init[k[0]][k[1]] === true
    for (let v of this.vrefs) {
      let keys = []
      this.getKey(v, keys)
      const val = get(i)
      i++
      let json = this.json
      for (let i2 = 0; i2 < keys.length; i2++) {
        let k = keys[i2]
        if (json === null) {
          let t = type(k)
          set(k)
          if (t === 0) {
            this.json = []
            json = this.json
            if (i2 === keys.length - 1) {
              json[0] = val
              break
            }
            if (i2 === keys.length - 2) {
              const k2 = keys[i2 + 1]
              if (type(k2) === 0) {
                json.push([val])
                break
              }
            } else {
              const k2 = keys[i2 + 1]
              if (type(k2) === 0) {
                set(k2)
                json.push([])
                json = json[json.length - 1]
              } else if (type(k2) === 1) {
                set(k2)
                json.push({})
                json = json[json.length - 1]
              }
            }
          } else {
            this.json = {}
            json = this.json
            if (i2 === keys.length - 2) {
              const k2 = keys[i2 + 1]
              json[k2] = val
              break
            }
          }
          if (i2 !== keys.length - 2) continue
        } else if (i2 === 0) {
          const k2 = keys[i2 + 1]
          const t1 = type(k)
          if (t1 === 0) {
            if (keys.length === 1) {
              json.push(val)
              break
            } else if (keys.length === 2) {
              if (!ex(k2)) set(k2) && json.push([])
              json = json[json.length - 1]
              json.push(val)
              break
            }
            const t2 = type(k2)
            if (t2 === 0) {
              if (!ex(k2)) set(k2) && json.push([])
              json = json[json.length - 1]
            } else if (t2 === 1) {
              if (!ex(k2)) set(k2) && json.push({})
              json = json[json.length - 1]
            }
          } else if (t1 === 1) {
            if (keys.length === 2) {
              json[k2] = val
              break
            }
          }
          continue
        }
        if (i2 === keys.length - 2) {
          const jtype = Array.isArray(json) ? 0 : 1
          const ctype = type(k)
          const k2 = keys[i2 + 1]
          const ntype = type(k2)
          if (ctype === 0 && ntype === 0) {
            if (!ex(k2)) set(k2) && json.push([])
            json = json[json.length - 1]
            json.push(val)
            break
          } else if (ctype === 1 && ntype === 2) {
            json[k2] = val
            break
          } else if (jtype === 1 && ctype === 2) {
            if (ntype === 0) {
              json[k] ??= []
              json[k].push(val)
            }
            break
          } else {
            //console.log("impossible 4")
          }
        } else {
          const jtype = Array.isArray(json) ? 0 : 1
          const ctype = type(k)
          const k2 = keys[i2 + 1]
          const ntype = type(k2)
          if (jtype === 1 && ctype === 2) {
            if (ntype === 0) {
              json[k] ??= []
              json = json[k]
            } else if (ntype === 1) {
              json[k] ??= {}
              json = json[k]
            } else {
              //console.log("impossible 5")
            }
          } else if (jtype === 0 && ctype === 1) {
            // console.log("impossible 6")
          } else if (jtype === 0 && ctype === 0) {
            if (ntype === 0) {
              if (!ex(k2)) set(k2) && json.push([])
              json = json[json.length - 1]
            } else if (ntype === 1) {
              if (!ex(k2)) set(k2) && json.push({})
              json = json[json.length - 1]
            } else {
              // console.log("impossible 7")
            }
          } else if (jtype === 1 && ctype === 1) {
            // nothing
          } else {
            //console.log("impossible 8")
          }
        }
      }
    }
  }
}
