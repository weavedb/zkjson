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
    this.rcount = 0
    this.tcount = 0
    this.dlinks = []
    this.dlinks_len = 0
    this.types = []
    this.types_len = 0
    this.keys = []
    this.keys_len = 0
    this.indexes = []
    this.indexes_len = 0
    this.dc = []
    this.dc_len = 0
    this.nums = []
    this.nums_len = 0
    this.dvals = []
    this.dvals_len = 0
    this.oid = 0
    this.iid = 0
  }
  push_dlink(v, flag = 0) {
    const d = bits(this.dcount + 1)
    this.dlinks_len = add(this.dlinks, this.dlinks_len, flag, 1)
    this.dlinks_len = add(this.dlinks, this.dlinks_len, v, d)
    if (flag === 1) this.rcount++
  }
  push_type(v) {
    let count = this.tcount
    if (count > 3) {
      this.types_len = add(this.types, this.types_len, 0, 3)
      if (count < 16) {
        const d = count < 4 ? 2 : bits(count)
        this.types_len = add(this.types, this.types_len, d - 2, 2)
        this.types_len = add(this.types, this.types_len, count, d)
      } else {
        this.types_len = add(this.types, this.types_len, 3, 2)
        while (count >= 128) {
          this.types_len = add(
            this.types,
            this.types_len,
            (count & 0x7f) | 0x80,
            8,
          )
          count >>>= 7
        }
        this.types_len = add(this.types, this.types_len, count, 8)
      }
      this.types_len = add(this.types, this.types_len, v, 3)
    } else {
      for (let i = 0; i < count; i++) {
        this.types_len = add(this.types, this.types_len, v, 3)
      }
    }
    this.tcount = 1
  }
  push_keylen(v) {
    if (v < 16) {
      const d = v < 4 ? 2 : bits(v)
      this.keys_len = add(this.keys, this.keys_len, d - 2, 2)
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
  push_index(v) {
    if (v < 16) {
      const d = v < 4 ? 2 : bits(v)
      this.indexes_len = add(this.indexes, this.indexes_len, d - 2, 2)
      this.indexes_len = add(this.indexes, this.indexes_len, v, d)
    } else {
      this.indexes_len = add(this.indexes, this.indexes_len, 3, 2)
      while (v >= 128) {
        this.indexes_len = add(
          this.indexes,
          this.indexes_len,
          (v & 0x7f) | 0x80,
          8,
        )
        v >>>= 7
      }
      this.indexes_len = add(this.indexes, this.indexes_len, v, 8)
    }
  }

  push_int(v) {
    if (v < 64) {
      const d = v < 8 ? 3 : v < 16 ? 4 : 6
      const flag = v < 8 ? 0 : v < 16 ? 1 : 2
      this.nums_len = add(this.nums, this.nums_len, flag, 2)
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
    if (v < 4) this.push_int(neg ? 4 + v : v)
    else this.push_int(neg ? 4 : 0)
  }

  calc_dcount() {
    const v = this.rcount
    if (v < 16) {
      const d = v < 4 ? 2 : bits(v)
      this.dc_len = add(this.dc, this.dc_len, d - 2, 2)
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
    this.oid = 0
    this.iid = 0
    this.len = 0
    this.tlen = 0
    this.dlen = 0
    this.jlen = 0
    this.dcount = 0
    this.rcount = 0
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
    this.tcount = 0
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
    let total = 0
    if (this.log) {
      console.log(total, "rcount", this.dc, this.dc_len, this.rcount)
      total += this.dc_len
      console.log(total, "dlinks", this.dlinks, this.dlinks_len)
      total += this.dlinks_len
      console.log(total, "keylens", this.keys, this.keys_len)
      total += this.keys_len
      console.log(total, "types", this.types, this.types_len)
      total += this.types_len
      console.log(total, "nums", this.nums, this.nums_len)
      total += this.nums_len
      console.log(total, "indexes", this.indexes, this.indexes_len)
      total += this.indexes_len
    }
    const _total =
      this.dc_len +
      this.dlinks_len +
      this.types_len +
      this.keys_len +
      this.nums_len +
      this.indexes_len

    const pad_len = (8 - (_total % 8)) % 8
    if (this.log) {
      console.log(total, "pad", 0, pad_len)
      total += pad_len
    }
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
    writeBits(this.keys, this.keys_len)
    writeBits(this.types, this.types_len)
    writeBits(this.nums, this.nums_len)
    writeBits(this.indexes, this.indexes_len)
    if (pad_len > 0) writeBits([0], pad_len)
    if (this.log) {
      console.log()
      console.log(total, "dic", this.dic.subarray(0, this.dlen))
      total += this.dlen * 8
      console.log()
      console.log(total, "obj", this.obj.subarray(0, this.len))
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
  u.push_type(_encode_x(v, u))
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
    if (prev !== null) u.push_dlink(prev + 1, 1)
    // need various num types
    let moved = v % 1 === v ? 0 : getPrecision(v)
    const type = moved === 0 ? (v < 0 ? 5 : 4) : 6
    if (prev_type !== null && prev_type !== 4) u.push_type(prev_type)
    else u.tcount++
    if (moved > 0) {
      u.push_float(v < 0, moved)
      if (moved > 3) u.push_int(moved + 1)
    }
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
      pushPathNum(u, 0, prev, 1) // dcount = 1, prev + 1 = 2
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
  d.show()
  d.build(v)
  return d.json
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
module.exports = {
  encode_x,
  decode_x,
  u8,
}
