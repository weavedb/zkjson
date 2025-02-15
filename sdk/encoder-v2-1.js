const {
  clone,
  uniq,
  sortBy,
  map,
  concat,
  compose,
  is,
  descend,
  ascend,
  sortWith,
  prop,
  equals,
  append,
  isNil,
  includes,
  splitEvery,
  flatten,
} = require("ramda")

function add(arr, currBitLen, value, valueWidth) {
  const mask = valueWidth >= 32 ? 0xffffffff : (1 << valueWidth) - 1
  value &= mask
  const used = currBitLen & 31

  const free = used === 0 ? 32 : 32 - used
  if (valueWidth <= free) {
    if (used === 0) arr.push(value)
    else arr[arr.length - 1] = (arr[arr.length - 1] << valueWidth) | value
    return currBitLen + valueWidth
  }
  const high = value >>> (valueWidth - free)
  if (used === 0) arr.push(high)
  else arr[arr.length - 1] = (arr[arr.length - 1] << free) | high
  currBitLen += free
  let remaining = valueWidth - free
  if (remaining <= 32) {
    arr.push(value & ((1 << remaining) - 1))
    return currBitLen + remaining
  }
  while (remaining > 32) {
    arr.push((value >>> (remaining - 32)) & 0xffffffff)
    currBitLen += 32
    remaining -= 32
  }
  if (remaining > 0) {
    arr.push(value & ((1 << remaining) - 1))
    currBitLen += remaining
  }
  return currBitLen
}

function bits(n) {
  return n === 0 ? 1 : 32 - Math.clz32(n)
}

class u8 {
  constructor(size = 1000, log = false) {
    this.log = log
    this.obj = new Uint8Array(size)
    this.dic = new Uint8Array(size)
    this.len = 0
    this.tlen = 0
    this.dlen = 0
    this.jlen = 0
    this.dcount = 0
    this.tcount = 0
    this.dlinks = []
    this.dlinks_len = 0
    this.types = []
    this.types_len = 0
    this.keys = []
    this.keys_len = 0
    this.dc = []
    this.dc_len = 0
    this.nums = []
    this.nums_len = 0
    this.dvals = []
    this.dvals_len = 0
  }
  push_dlink(v, flag = 0) {
    const d = bits(this.dcount)
    this.dlinks_len = add(this.dlinks, this.dlinks_len, flag, 1)
    this.dlinks_len = add(this.dlinks, this.dlinks_len, v, d)
  }
  push_type(v) {
    let count = this.tcount
    if (count > 3) {
      add(this.types, this.types_len, 0, 3)
      if (count < 16) {
        const d = count < 4 ? 2 : bits(count)
        this.keys_len = add(this.keys, this.keys_len, count, d)
      } else {
        this.keys_len = add(this.keys, this.keys_len, 3, 2)
        while (count >= 128) {
          this.keys_len = add(
            this.keys,
            this.keys_len,
            (count & 0x7f) | 0x80,
            8,
          )
          count >>>= 7
        }
        this.keys_len = add(this.keys, this.keys_len, count, 8)
      }
      this.types_len = add(this.types, this.types_len, v, 3)
    } else {
      for (let i = 0; i < count; i++) {
        this.types_len = add(this.types, this.types_len, v, 3)
      }
    }
    this.tcount = 0
  }
  push_keylen(v) {
    if (v < 16) {
      const d = v < 4 ? 2 : bits(v)
      this.keys_len = add(this.keys, this.keys_len, v, d)
    } else {
      this.keys_len = add(this.keys, this.keys_len, 3, 2)
      while (v >= 128) {
        this.keys_len = add(this.keys, this.keys_len, (v & 0x7f) | 0x80, 8)
        v >>>= 7
      }
      this.keys_len = add(this.keys, this.keys_len, v, 8)
    }
  }
  push_int(v) {
    if (v < 64) {
      const d = v < 8 ? 3 : v < 16 ? 4 : 5
      this.nums_len = add(this.nums, this.nums_len, v, d)
    } else {
      this.nums_len = add(this.nums, this.nums_len, 3, 2)
      while (v >= 128) {
        this.nums_len = add(this.nums, this.nums_len, (v & 0x7f) | 0x80, 8)
        v >>>= 7
      }
      this.nums_len = add(this.nums, this.nums_len, v, 8)
    }
  }
  push_float(neg, v) {
    if (v < 4) {
      if (neg) this.push(4 + v)
      else this.push(v)
    } else {
      if (neg) this.push(4)
      else this.push(0)
    }
  }

  calc_dcount() {
    const v = this.dcount
    if (v < 16) {
      const d = bits(v)
      this.dc_len = add(this.dc, this.dc_len, v, d)
    } else {
      this.dc_len = add(this.dc, this.dc_len, 3, 2)
      while (v >= 128) {
        this.dc_len = add(this.dc, this.dc_len, (v & 0x7f) | 0x80, 8)
        v >>>= 7
      }
      this.dc_len = add(this.dc, this.dc_len, v, 8)
    }
  }
  reset() {
    this.dvals = []
    this.dvals_len = 0
    this.len = 0
    this.tlen = 0
    this.dlen = 0
    this.jlen = 0
    this.dcount = 0
    this.dlinks = []
    this.dlinks_len = 0
    this.types = []
    this.types_len = 0
    this.keys = []
    this.keys_len = 0
    this.dc = []
    this.dc_len = 0
    this.nums = []
    this.nums_len = 0
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
    this.calc_dcount()
    if (this.log) {
      console.log("dcount", this.dc, this.dc_len, this.dcount)
      console.log("dlinks", this.dlinks, this.dlinks_len)
      console.log("types", this.types, this.types_len)
      console.log("keylens", this.keys, this.keys_len)
      console.log("nums", this.nums, this.nums_len)
    }
    const total =
      this.dc_len +
      this.dlinks_len +
      this.types_len +
      this.keys_len +
      this.nums_len
    const pad_len = (8 - (total % 8)) % 8
    if (this.log) console.log("pad", 0, pad_len)
    const bit_len = (total + pad_len) / 8
    const len = bit_len + this.len + this.dlen
    const arr = new Uint8Array(len)

    let outIndex = 0 // current byte index in arr
    let accumulator = 0 // accumulator for bits (building one byte)
    let accBits = 0 // number of bits currently in accumulator

    function writeNumberBits(num, bitsLength) {
      while (bitsLength > 0) {
        const free = 8 - accBits // available bits in the current byte
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
          const part = num >> shift // get the top free bits
          accumulator = (accumulator << free) | (part & ((1 << free) - 1))
          arr[outIndex++] = accumulator
          num = num & ((1 << shift) - 1) // remove the written bits
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
    writeBits(this.dc, this.dc_len)
    writeBits(this.dlinks, this.dlinks_len)
    writeBits(this.types, this.types_len)
    writeBits(this.keys, this.keys_len)
    writeBits(this.nums, this.nums_len)
    if (pad_len > 0) writeBits([0], pad_len)
    arr.set(this.dic.subarray(0, this.dlen), bit_len)
    arr.set(this.obj.subarray(0, this.len), bit_len + this.dlen)
    return arr
  }
}

function pushPathStr(u, v2, prev = null) {
  if (u.dcount > 0) u.push_dlink(prev === null ? 0 : prev + 1)
  const len = v2.length
  u.push_keylen(len + 1)
  if (len === 0) u.push_d(1)
  else for (let i = 0; i < len; i++) u.to128_d(v2.charCodeAt(i))
  u.dcount++
}

function pushPathNum(u, v2, prev = null) {
  if (u.dcount > 0) u.push_dlink(prev === null ? 0 : prev + 1)
  u.push_keylen(0)
  u.to128_d(v2)
  u.dcount++
}

function encode_x(v, u) {
  u.reset()
  u.push_type(_encode_x(v, u))
  return u.dump()
}

// 0: repeat, 1: null, 2: true, 3: false, 4: uint, 5: neg, 6: float, 7: str
function _encode_x(v, u, plen = 0, prev = null, prev_type = null) {
  if (typeof v === "number") {
    if (prev !== null) u.push_dlink(prev + 1, 1)
    // need various num types
    let moved = 0
    let num = v
    while (num % 1 != 0) {
      num *= 10
      moved += 1
    }
    const type = moved === 0 ? (v < 0 ? 5 : 4) : 6
    if (prev_type !== null && prev_type !== 4) u.push_type(type)
    else u.tcount++
    if (moved > 0) {
      u.push_float(v < 0, moved)
      if (moved > 3) u.push_int(moved)
    }
    u.push_int(v < 0 ? -num : num)
    return type
  } else if (typeof v === "boolean") {
    if (prev !== null) u.push_dlink(prev + 1, 1)
    const type = v ? 2 : 3
    if (prev_type !== null && prev_type !== type) u.push_type(type)
    else u.tcount++
    return type
  } else if (v === null) {
    if (prev !== null) u.push_dlink(prev + 1, 1)
    if (prev_type !== null && prev_type !== 1) u.push_type(1)
    else u.tcount++
    return 1
  } else if (typeof v === "string") {
    if (prev !== null) u.push_dlink(prev + 1, 1)
    if (prev_type !== null && prev_type !== 7) u.push_type(7)
    else u.tcount++
    const len = v.length
    u.to128_d(len)
    return 7
    for (let i = 0; i < len; i++) u.to128_d(v.charCodeAt(i))
  } else if (Array.isArray(v)) {
    let i = 0
    for (const v2 of v) {
      const _prev = u.dcount
      if (i === 0) pushPathNum(u, v.length, prev)
      prev_type = _encode_x(v2, u, plen + 1, i === 0 ? _prev : null, prev_type)
      i++
    }
    return prev_type
  } else if (typeof v === "object") {
    for (const k in v) {
      const _prev = u.dcount
      pushPathStr(u, k, prev)
      prev_type = _encode_x(v[k], u, plen + 1, _prev, prev_type)
    }
    return prev_type
  }
}

module.exports = {
  encode_x,
  u8,
}
