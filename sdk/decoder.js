function bits(n) {
  return n === 0 ? 1 : 32 - Math.clz32(n)
}

function tobits(arr, cursor = 0) {
  // Convert the input array to a continuous string of 8-bit binary segments.
  let bitStr = ""
  for (let i = 0; i < arr.length; i++) {
    bitStr += arr[i].toString(2).padStart(8, "0")
  }
  // Slice off the bits before the cursor.
  let remaining = bitStr.slice(cursor)

  let result = []
  // Determine how many bits remain in the current (partial) byte.
  let offset = cursor % 8
  if (offset !== 0) {
    // The first chunk is the remaining bits of that byte:
    let firstChunkSize = 8 - offset // e.g. if cursor=18 then offset=2, firstChunkSize=6.
    result.push(remaining.slice(0, firstChunkSize))
    remaining = remaining.slice(firstChunkSize)
  }
  // Break the remaining bits into full 8-bit chunks.
  while (remaining.length >= 8) {
    result.push(remaining.slice(0, 8))
    remaining = remaining.slice(8)
  }
  // If any bits remain, add them as the last chunk.
  if (remaining.length > 0) result.push(remaining)

  return result
}

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
    console.log("decoding........................................")
    console.log(v)
    console.log(tobits(v))
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
    //this.build()
  }
  getLen() {
    this.len = this.short()
  }
  show() {
    console.log()
    console.log("len", this.len, "drefs", this.drefs, "vrefs", this.vrefs)
    console.log("keylens", this.keylens)
    console.log("types", this.types)
    console.log("nums", this.nums)
    console.log("indexes", this.indexes)
    console.log("keys", this.keys)
  }
  getDlinks() {
    console.log()
    console.log("get dlinks............................")
    this.bits()
    let ind = 1
    let i = 0
    while (i < this.len) {
      const flag = this.n(1)
      const x = this.n(bits(ind + 1))
      if (flag === 0) this.drefs.push(x)
      else {
        this.vrefs.push(x)
      }
      if (flag === 1) i++
      else if (flag === 0) ind++
    }
  }
  getKeyLens() {
    console.log()
    console.log("get keylens............................")
    this.bits()
    if (this.drefs.length === 0) return
    for (let i = 0; i < this.drefs.length + 1; i++) {
      const int = this.short()
      this.keylens.push(int)
    }
  }
  getIndexes() {
    console.log()
    console.log("get indexes............................")
    this.bits()
    for (const v of this.keylens) {
      if (v > 1) continue
      const int = this.short()
      this.indexes.push(int)
    }
  }

  getTypes() {
    console.log()
    console.log("get types............................")
    this.bits()
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
    console.log()
    console.log("get nums.............")
    this.bits()
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
    console.log()
    console.log("get keys....................................")
    this.bits()
    let ind = 0
    for (let i = 0; i < this.keylens.length; i++) {
      const len = this.keylens[i]
      if (len < 3) {
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
    let init = [[], []]
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
    for (let v of this.vrefs) {
      let keys = []
      this.getKey(v, keys)
      const val = get(i)
      console.log()
      console.log("[keys]", keys, val, "------------------------------------")
      let json = this.json
      for (let i2 = 0; i2 < keys.length; i2++) {
        let k = keys[i2]
        console.log("[key]", k)
        if (Array.isArray(k)) {
          if (typeof init[k[0]][k[1]] === "undefined") {
            init[k[0]][k[1]] = true
            if (json === null) {
              if (k[0] === 0) this.json = []
              else if (k[0] === 1) this.json = {}
              json = this.json
            } else {
              if (Array.isArray(json)) {
                if (k[0] === 0) json.push([])
                if (k[0] === 1) json.push({})
                json = json[json.length - 1]
              }
            }
          } else {
            if (Array.isArray(json)) {
              if (i2 === keys.length - 1) json.push(val)
              else json = json[json.length - 1]
            }
          }
        } else if (i2 !== keys.length - 1) {
          if (typeof json[k] !== "undefined") {
            json = json[k]
            let k2 = keys[i2 + 1]
            if (Array.isArray(k2) && i2 + 1 !== keys.length - 1) i2++
          } else {
            let k2 = keys[i2 + 1]
            if (typeof k2 === "string") {
              json[k] = {}
            } else if (Array.isArray(k2)) {
              if (k2[0] === 0) {
                json[k] = []
              } else if (k2[0] === 1) {
                json[k] = {}
              }
              init[k2[0]][k2[1]] = true
              if (i2 + 1 !== keys.length - 1) i2++
            }
            json = json[k]
          }
        } else json[k] = val
        console.log("[json]", json, this.json)
      }
      i++
    }
  }
}
