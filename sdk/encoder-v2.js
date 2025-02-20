const { bits, tobits, strmap, base64 } = require("./utils.js")
class u8 {
  constructor(size = 1000, log = false) {
    this.size = size
    this.log = log
    this.obj = new Uint8Array(size)
    this.dic = new Uint8Array(size)
  }
  add(tar, val, vlen) {
    let b = this.b[tar]
    val &= vlen >= 32 ? 0xffffffff : (1 << vlen) - 1
    const used = b.len & 31
    const free = used === 0 ? 32 : 32 - used
    if (vlen <= free) {
      if (used === 0) b.arr.push(val)
      else b.arr[b.arr.length - 1] = (b.arr[b.arr.length - 1] << vlen) | val
      b.len += vlen
      return
    }
    const high = val >>> (vlen - free)
    if (used === 0) b.arr.push(high)
    else b.arr[b.arr.length - 1] = (b.arr[b.arr.length - 1] << free) | high
    b.len += free
    let rest = vlen - free
    if (rest <= 32) {
      b.arr.push(val & ((1 << rest) - 1))
      b.len += rest
      return
    }
    while (rest > 32) {
      b.arr.push((val >>> (rest - 32)) & 0xffffffff)
      b.len += 32
      rest -= 32
    }
    if (rest > 0) {
      b.arr.push(val & ((1 << rest) - 1))
      b.len += rest
    }
  }

  flush_dlink() {
    const dc = this.dlink_cache
    if (dc !== null) {
      if (dc[2] < 3) {
        for (let i = 0; i < dc[2]; i++) this._push_dlink(dc[1], dc[0], dc[3][i])
      } else {
        const count = dc[0] === 1 ? this.dcount : this.dcount2
        const d = bits(count + 1)
        this.add("dlinks", dc[0], 1)
        this.add("dlinks", 0, d)

        // length push as short
        this.short("dlinks", dc[2])

        // value as uint
        this.uint("dlinks", dc[1])
        this.dcount2 += dc[2]
      }
    }
  }
  push_dlink(v, flag = 0) {
    /*if (typeof this.prev_link === "undefined") {
      console.log("dlink", v, "diff", 0)
    } else {
      console.log("flag", flag, "dlink", v, "diff", v - this.prev_link)
    }*/
    this.prev_link = v
    let dc = this.dlink_cache
    if (dc === null) this.dlink_cache = [flag, v, 1, [this.dcount]]
    else if (dc[0] === flag && dc[1] === v) {
      dc[2] += 1
      dc[3].push(this.dcount)
    } else {
      if (dc[2] === 1) this._push_dlink(dc[1], dc[0], dc[3][0])
      else this.flush_dlink()
      this.dlink_cache = [flag, v, 1, [this.dcount]]
    }
    if (flag === 1) this.rcount++
    else this.dcount2++
  }
  _push_dlink(v, flag = 0, count) {
    this.add("dlinks", flag, 1)
    this.add("dlinks", v, bits(count + 1))
  }
  push_type(v) {
    let count = this.tcount
    if (count > 3) {
      this.add("types", 0, 3)
      if (count < 16) this.short("types", count)
      else this.lh128("types", count)
      this.add("types", v, 3)
    } else for (let i = 0; i < count; i++) this.add("types", v, 3)
    this.tcount = 1
  }
  push_keylen(v) {
    if (v < 16) this.short("keys", v)
    else this.lh128("keys", v)
  }
  push_index(v) {
    if (v < 16) this.short("indexes", v)
    else this.lh128("indexes", v)
  }

  push_int(v) {
    let diff = 0
    if (this.prev_num === null) diff = v
    else diff = v - this.prev_num
    this.prev_num = v
    if (diff < 0) diff = Math.abs(diff) + 3
    const isDiff = diff < 8
    this.dint(isDiff ? diff : v, isDiff)
  }
  push_float(neg, v) {
    if (v < 4) this.push_int(neg ? 4 + v : v)
    else this.push_int(neg ? 4 : 0)
  }

  flush_nums() {
    const dc = this.nums_cache
    if (dc !== null) {
      if (dc[2] < 3) {
        for (let i = 0; i < dc[2]; i++) this._dint(dc[1], dc[0])
      } else {
        this.flag_len += 2
        this.add("nums", 0, 2)
        this.add("nums", 7, 3)
        this.short("nums", dc[2])
        if (dc[0]) {
          this.add("nums", 0, 2)
          this.add("nums", dc[1], 3)
        } else if (dc[1] < 64) {
          const d = dc[1] < 16 ? 4 : 6
          const flag = dc[1] < 16 ? 1 : 2
          this.flag_len += 2
          this.add("nums", flag, 2)
          this.add("nums", dc[1], d)
        } else this.lh128("nums", dc[1])
      }
    }
  }

  dint(v, diff = false) {
    let dc = this.nums_cache
    if (dc === null) this.nums_cache = [diff, v, 1]
    else if (dc[0] === diff && dc[1] === v) {
      dc[2] += 1
    } else {
      if (dc[2] === 1) this._dint(dc[1], dc[0])
      else this.flush_nums()
      this.nums_cache = [diff, v, 1]
    }
  }
  _dint(v, diff) {
    const tar = "nums"
    // 1 bit diff mode can be set 1 or 2 or 3
    if (diff) {
      this.flag_len += 2
      this.add(tar, 0, 2)
      this.add(tar, v, 3)
    } else if (v < 64) {
      const d = v < 16 ? 4 : 6
      const flag = v < 16 ? 1 : 2
      //console.log("flag.....1", flag)
      this.flag_len += 2
      this.add(tar, flag, 2)
      this.add(tar, v, d)
    } else this.lh128(tar, v)
  }

  uint(tar, v) {
    if (v < 64) {
      const d = v < 8 ? 3 : v < 16 ? 4 : 6
      const flag = v < 8 ? 0 : v < 16 ? 1 : 2
      //console.log("flag.....1", flag)
      this.flag_len += 2
      this.add(tar, flag, 2)
      this.add(tar, v, d)
    } else this.lh128(tar, v)
  }
  lh128_2(tar, v) {
    while (v >= 128) {
      this.add(tar, (v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add(tar, v, 8)
  }
  lh128(tar, v) {
    this.add(tar, 3, 2)
    //console.log("flag.....2", 3)
    this.flag_len += 2
    while (v >= 128) {
      this.add(tar, (v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add(tar, v, 8)
  }
  short(tar, v) {
    if (v < 16) {
      const d = v < 4 ? 2 : bits(v)
      //console.log("flag.....3", d - 2)
      this.flag_len += 2
      this.add(tar, d - 2, 2)
      this.add(tar, v, d)
    } else this.lh128(tar, v)
  }
  reset() {
    this.prev_num = 0
    this.nums_count = 0
    this.prev_link = 0
    this.flag_len = 0
    this.single = true
    this.len = 0
    this.tlen = 0
    this.dlen = 0
    this.jlen = 0
    this.dcount = 0
    this.dcount2 = 0
    this.rcount = 0
    this.tcount = 0

    this.types_len = 0
    this.oid = 0
    this.iid = 0
    this.dlink_cache = null
    this.nums_cache = null
    this.types = []

    this.b = {
      dlinks: { len: 0, arr: [] },
      keys: { len: 0, arr: [] },
      types: { len: 0, arr: [] },
      nums: { len: 0, arr: [] },
      indexes: { len: 0, arr: [] },
      dc: { len: 0, arr: [] },
    }
  }
  push_d(v) {
    this.dic[this.dlen++] = v
  }

  push(v) {
    this.obj[this.len++] = v
  }
  to128_d(n) {
    while (n >= 128) {
      this.dic[this.dlen++] = (n & 0x7f) | 0x80
      n >>>= 7
    }
    this.dic[this.dlen++] = n
  }

  to128(n) {
    while (n >= 128) {
      this.obj[this.len++] = (n & 0x7f) | 0x80
      n >>>= 7
    }
    this.obj[this.len++] = n
  }
  copy() {
    this.obj.set(this.temp.subarray(0, this.tlen), this.len)
    this.len += this.tlen
  }

  dump() {
    //console.log("total flag", this.flag_len)
    if (!this.single) {
      this.flush_dlink()
      this.flush_nums()
      this.add("dc", this.single ? 1 : 0, 1)
      this.short("dc", this.rcount)
    }
    let total = 0
    if (this.log) {
      console.log(total, `rcount(${this.rcount})`, this.b.dc.arr, this.b.dc.len)
      total += this.b.dc.len
      console.log(total, "dlinks", this.b.dlinks.arr, this.b.dlinks.len)
      total += this.b.dlinks.len
      console.log(total, "keylens", this.b.keys.arr, this.b.keys.len)
      total += this.b.keys.len
      console.log(total, "types", this.b.types.arr, this.b.types.len)
      total += this.b.types.len
      console.log(total, "nums", this.b.nums.arr, this.b.nums.len)
      total += this.b.nums.len
      console.log(total, "indexes", this.b.indexes.arr, this.b.indexes.len)
      total += this.b.indexes.len
    }

    const _total =
      this.b.dc.len +
      this.b.dlinks.len +
      this.b.types.len +
      this.b.keys.len +
      this.b.nums.len +
      this.b.indexes.len

    const pad_len = (8 - (_total % 8)) % 8
    if (this.log) {
      console.log(total, "pad", 0, pad_len)
      total += pad_len
    }

    const bit_len = (_total + pad_len) / 8
    const len = bit_len + this.len + this.dlen
    const arr = new Uint8Array(len)

    let outIndex = 0
    let accumulator = 0
    let accBits = 0

    function writeNumberBits(num, bitsLength) {
      while (bitsLength > 0) {
        const free = 8 - accBits
        if (bitsLength <= free) {
          accumulator =
            (accumulator << bitsLength) | (num & ((1 << bitsLength) - 1))
          accBits += bitsLength
          bitsLength = 0
          if (accBits === 8) {
            arr[outIndex++] = accumulator
            accumulator = 0
            accBits = 0
          }
        } else {
          const shift = bitsLength - free
          const part = num >> shift
          accumulator = (accumulator << free) | (part & ((1 << free) - 1))
          arr[outIndex++] = accumulator
          num = num & ((1 << shift) - 1)
          bitsLength -= free
          accumulator = 0
          accBits = 0
        }
      }
    }

    function writeBits(valueArray, bitsLength) {
      let remaining = bitsLength
      for (let i = 0; i < valueArray.length; i++) {
        const bitsForThis = remaining > 32 ? 32 : remaining
        writeNumberBits(valueArray[i] >>> 0, bitsForThis)
        remaining -= bitsForThis
      }
    }
    writeBits(this.b.dc.arr, this.b.dc.len)
    writeBits(this.b.dlinks.arr, this.b.dlinks.len)
    writeBits(this.b.keys.arr, this.b.keys.len)
    writeBits(this.b.types.arr, this.b.types.len)
    writeBits(this.b.nums.arr, this.b.nums.len)
    writeBits(this.b.indexes.arr, this.b.indexes.len)

    if (pad_len > 0) writeBits([0], pad_len)
    if (this.log) {
      console.log()
      console.log(total, "dic", this.dic.subarray(0, this.dlen))
      total += this.dlen * 8
      console.log()
      console.log(total, "obj", this.obj.subarray(0, this.len))
      total += this.len * 8
      console.log()
      console.log(total, "bits", total / 8, "bytes")
      console.log()
    }
    arr.set(this.dic.subarray(0, this.dlen), bit_len)
    arr.set(this.obj.subarray(0, this.len), bit_len + this.dlen)
    return arr
  }
}

function pushPathStr(u, v2, prev = null) {
  if (u.dcount > 0) u.push_dlink(prev === null ? 0 : prev + 1)
  const len = v2.length
  u.push_keylen(len + 2)
  if (len === 0) u.push_d(1)
  else for (let i = 0; i < len; i++) u.to128_d(v2.charCodeAt(i))
  u.dcount++
}

function pushPathNum(u, v2, prev = null, keylen) {
  if (u.dcount > 0) u.push_dlink(prev === null ? 0 : prev + 1)
  u.push_keylen(keylen)
  const id = keylen === 0 ? u.iid++ : u.oid++
  u.push_index(id)
  u.dcount++
}

function encode_x(v, u) {
  u.reset()
  if (v === null) {
    u.add("dc", 1, 1)
    u.add("dc", 0, 7)
  } else if (typeof v !== "object") {
    u.add("dc", 1, 1)
    if (v === true) u.add("dc", 1, 7)
    else if (v === false) u.add("dc", 2, 7)
    else if (v === "") u.add("dc", 3, 7)
    else if (typeof v === "number") {
      const moved = v % 1 === v ? 0 : getPrecision(v)
      const type = moved === 0 ? (v < 0 ? 5 : 4) : v < 0 ? 7 : 6
      if (type === 4) {
        u.add("dc", 1, 1)
        if (v < 63) {
          u.add("dc", v, 6)
        } else {
          u.add("dc", 63, 6)
          u.lh128_2("dc", v - 63)
        }
      } else {
        u.add("dc", 0, 1)
        u.add("dc", type + 1, 6)
        if (moved > 0) u.uint("dc", moved)
        u.uint("dc", (v < 0 ? -1 : 1) * v * Math.pow(10, moved))
      }
    } else if (typeof v === "string") {
      u.add("dc", 0, 1)
      if (v.length === 1 && typeof strmap[v] !== "undefined") {
        u.add("dc", strmap[v] + 9, 6)
      } else if (v.length === 1) {
        u.add("dc", 61, 6)
        u.lh128_2("dc", v.charCodeAt(0))
      } else {
        let is64 = true
        for (let i = 0; i < v.length; i++) {
          if (typeof base64[v[i]] === "undefined") {
            is64 = false
            break
          }
        }
        if (is64) {
          u.add("dc", 62, 6)
          u.short("dc", v.length)
          for (let i = 0; i < v.length; i++) {
            u.add("dc", base64[v[i]], 6)
          }
        } else {
          u.add("dc", 63, 6)
          u.short("dc", v.length)
          for (let i = 0; i < v.length; i++) u.lh128_2("dc", v.charCodeAt(i))
        }
      }
    }
  } else if (Array.isArray(v) && v.length === 0) {
    u.add("dc", 1, 1)
    u.add("dc", 4, 7)
  } else if (Object.keys(v).length === 0) {
    u.add("dc", 1, 1)
    u.add("dc", 5, 7)
  } else {
    u.single = false
    u.push_type(_encode_x(v, u))
  }
  return u.dump()
}

function getPrecision(v) {
  const s = v.toString()
  const dot = s.indexOf(".")
  if (dot === -1) return 0
  const frac = s.slice(dot + 1).replace(/0+$/, "")
  return frac.length
}

// 0: repeat, 1: null, 2: true, 3: false, 4: uint, 5: neg, 6: float, 7: str
function _encode_x(
  v,
  u,
  plen = 0,
  prev = null,
  prev_type = null,
  index = null,
) {
  if (typeof v === "number") {
    // dlink
    if (prev !== null) u.push_dlink(prev + 1, 1)

    // [1] need various num types
    const moved = v % 1 === v ? 0 : getPrecision(v)
    const type = moved === 0 ? (v < 0 ? 5 : 4) : 6

    // [2] push type
    if (prev_type !== null && prev_type !== 4) u.push_type(prev_type)
    else u.tcount++
    if (moved > 0) {
      // [3] push float
      u.push_float(v < 0, moved + 1)
      // [4] push int
      if (moved > 2) u.push_int(moved + 1)
    }
    // [5] push int again
    u.push_int((v < 0 ? -1 : 1) * v * Math.pow(10, moved))
    return type
  } else if (typeof v === "boolean") {
    if (prev !== null) u.push_dlink(prev + 1, 1)
    const type = v ? 2 : 3
    if (prev_type !== null && prev_type !== type) u.push_type(prev_type)
    else u.tcount++
    return type
  } else if (v === null) {
    if (prev !== null) u.push_dlink(prev + 1, 1)
    if (prev_type !== null && prev_type !== 1) u.push_type(prev_type)
    else u.tcount++
    return 1
  } else if (typeof v === "string") {
    if (prev !== null) u.push_dlink(prev + 1, 1)
    if (prev_type !== null && prev_type !== 7) u.push_type(prev_type)
    else u.tcount++
    const len = v.length
    u.to128(len)
    for (let i = 0; i < len; i++) u.to128(v.charCodeAt(i))
    return 7
  } else if (Array.isArray(v)) {
    if (v.length === 0) {
      if (prev !== null) u.push_dlink(prev + 1, 1)
      u.push_type(prev_type)
      u.push_float(false, 1)
      return 6
    } else {
      const _prev = u.dcount
      pushPathNum(u, index, prev, 0)
      let i = 0
      for (const v2 of v) {
        prev_type = _encode_x(v2, u, plen + 1, _prev, prev_type, i)
        i++
      }
    }
    return prev_type
  } else if (typeof v === "object") {
    if (Object.keys(v).length === 0) {
      if (prev !== null) u.push_dlink(prev + 1, 1)
      u.push_type(prev_type)
      u.push_float(true, 1)
      return 6
    } else {
      pushPathNum(u, 0, prev, 1)
      const __prev = u.dcount
      for (const k in v) {
        const _prev = u.dcount
        pushPathStr(u, k, __prev - 1)
        prev_type = _encode_x(v[k], u, plen + 1, _prev, prev_type)
      }
      return prev_type
    }
  }
}

function decode_x(v, d) {
  d.decode(v)
  return d.json
}

module.exports = { encode_x, decode_x, u8 }
