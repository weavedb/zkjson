const { bits, tobits, strmap, base64 } = require("./utils.js")

class u8 {
  constructor(size = 100, log = false) {
    this.log = log

    this.kc_counts = new Uint32Array(32)
    this.vc_counts = new Uint32Array(32)
    this.kc_diffs = new Uint32Array(4)
    this.vc_diffs = new Uint32Array(4)
    this.vlinks = new Uint32Array(32)
    this.klinks = new Uint32Array(32)
    this.vflags = new Uint32Array(16)
    this.kflags = new Uint32Array(16)
    this.bools = new Uint32Array(16)
    this.keys = new Uint32Array(32)
    this.types = new Uint32Array(32)
    this.nums = new Uint32Array(32)
    this.dc = new Uint32Array(32)
    this.kvals = new Uint32Array(64)
    this.vals = new Uint32Array(64)

    this.strMap = new Map()

    this.bitsLookup = new Uint8Array(17)
    for (let i = 0; i < 17; i++) {
      this.bitsLookup[i] = i === 0 ? 1 : 32 - Math.clz32(i)
    }
  }
  fastBits(n) {
    return n < 17 ? this.bitsLookup[n] : bits(n)
  }

  vc_diffs_set(index, value) {
    const wordIndex = index >>> 5
    const bitOffset = index & 31
    if (value) {
      this.vc_diffs[wordIndex] |= 1 << bitOffset
    } else {
      this.vc_diffs[wordIndex] &= ~(1 << bitOffset)
    }
  }
  vc_diffs_get(index) {
    const wordIndex = index >>> 5
    const bitOffset = index & 31
    return (this.vc_diffs[wordIndex] >>> bitOffset) & 1
  }
  kc_diffs_set(index, value) {
    const wordIndex = index >>> 5
    const bitOffset = index & 31
    if (value) {
      this.kc_diffs[wordIndex] |= 1 << bitOffset
    } else {
      this.kc_diffs[wordIndex] &= ~(1 << bitOffset)
    }
  }
  kc_diffs_get(index) {
    const wordIndex = index >>> 5
    const bitOffset = index & 31
    return (this.kc_diffs[wordIndex] >>> bitOffset) & 1
  }

  add_vlinks(val, vlen) {
    this.vlinks_len = this._add(this.vlinks, this.vlinks_len, val, vlen)
  }
  add_klinks(val, vlen) {
    this.klinks_len = this._add(this.klinks, this.klinks_len, val, vlen)
  }
  add_vflags(val, vlen) {
    this.vflags_len = this._add(this.vflags, this.vflags_len, val, vlen)
  }
  add_kflags(val, vlen) {
    this.kflags_len = this._add(this.kflags, this.kflags_len, val, vlen)
  }
  add_bools(val, vlen) {
    this.bools_len = this._add(this.bools, this.bools_len, val, vlen)
  }
  add_keys(val, vlen) {
    this.keys_len = this._add(this.keys, this.keys_len, val, vlen)
  }
  add_types(val, vlen) {
    this.types_len = this._add(this.types, this.types_len, val, vlen)
  }
  add_nums(val, vlen) {
    this.nums_len = this._add(this.nums, this.nums_len, val, vlen)
  }
  add_dc(val, vlen) {
    this.dc_len = this._add(this.dc, this.dc_len, val, vlen)
  }
  add_kvals(val, vlen) {
    this.kvals_len = this._add(this.kvals, this.kvals_len, val, vlen)
  }
  add_vals(val, vlen) {
    this.vals_len = this._add(this.vals, this.vals_len, val, vlen)
  }

  _add(tar, len, val, vlen) {
    val &= vlen >= 32 ? 0xffffffff : (1 << vlen) - 1
    const used = len & 31
    const free = used === 0 ? 32 : 32 - used
    const idx = len >> 5

    if (vlen <= free) {
      if (used === 0) tar[idx] = val
      else tar[idx] = (tar[idx] << vlen) | val
      len += vlen
      return len
    }

    const high = val >>> (vlen - free)
    if (used === 0) tar[idx] = high
    else tar[idx] = (tar[idx] << free) | high
    len += free

    let rest = vlen - free
    if (rest <= 32) {
      tar[idx + 1] = val & ((1 << rest) - 1)
      len += rest
      return len
    }

    let writeIdx = idx + 1
    while (rest > 32) {
      tar[writeIdx++] = (val >>> (rest - 32)) & 0xffffffff
      len += 32
      rest -= 32
    }

    if (rest > 0) {
      tar[writeIdx] = val & ((1 << rest) - 1)
      len += rest
    }
    return len
  }

  push_vflag(flag) {
    this.add_vflags(flag, 1)
  }

  push_bool(bool) {
    this.add_bools(bool ? 1 : 0, 1)
  }

  push_kflag(flag) {
    this.add_kflags(flag, 1)
  }

  get_diff(v, prev) {
    let diff = prev === null ? v : v - prev
    let isDiff = false
    if (diff < 0) {
      diff = Math.abs(diff) + 3
      isDiff = diff < 7
    } else isDiff = diff < 4
    const v2 = isDiff ? diff : v
    return (v2 << 1) | (isDiff ? 1 : 0)
  }

  push_vlink(v) {
    let result = this.get_diff(v, this.prev_link)
    const isDiff = (result & 1) === 1
    const v2 = result >>> 1
    this.prev_link = v
    this.push_vflag(isDiff ? 1 : 0)
    this._push_vlink(v2, isDiff, this.dcount)
    this.rcount++
  }

  push_klink(v) {
    let result = this.get_diff(v, this.prev_klink)
    const isDiff = (result & 1) === 1
    const v2 = result >>> 1
    this.prev_klink = v
    this.push_kflag(isDiff ? 1 : 0)
    this._push_klink(v2, isDiff, this.dcount)
  }

  set_newbits(count) {
    const new_bits = this.fastBits(count + 1)
    if (new_bits > this.prev_bits) {
      const diff = new_bits - this.prev_bits
      for (let i = 0; i < diff; i++) {
        this.add_vlinks(0, this.prev_bits + i)
      }
      this.prev_bits = new_bits
    }
    return new_bits
  }

  set_newbits_k(count) {
    const new_bits = this.fastBits(count + 1)
    if (new_bits > this.prev_kbits) {
      const diff = new_bits - this.prev_kbits
      for (let i = 0; i < diff; i++) {
        this.add_klinks(0, this.prev_kbits + i)
      }
      this.prev_kbits = new_bits
    }
    return new_bits
  }

  _flush_vlink(v, diff, count) {
    if (diff) {
      this.add_vlinks(v + 1, 3)
    } else {
      const nb = this.set_newbits(count)
      this.add_vlinks(v + 1, nb)
    }
  }

  flush_vlink() {
    if (this.vc_v === null) return
    if (this.vc_count < 4) {
      for (let i = 0; i < this.vc_count; i++)
        this._flush_vlink(
          this.vc_v,
          this.vc_diffs_get(i) === 1,
          this.vc_counts[i],
        )
    } else {
      if (this.vc_diffs_get(0) === 1) {
        this.add_vlinks(0, 3)
        this.short_vlinks(this.vc_count)
        this.add_vlinks(this.vc_v + 1, 3)
      } else {
        const nb = this.set_newbits(this.vc_counts[0])
        this.add_vlinks(0, nb)
        this.short_vlinks(this.vc_count)
        this.add_vlinks(this.vc_v + 1, nb)
      }
    }
  }

  _push_vlink(v, diff, count) {
    if (this.vc_v === null) {
      this.vc_v = v
      this.vc_diffs_set(0, diff ? 1 : 0)
      this.vc_counts[0] = count
      this.vc_count = 1
    } else if (v === this.vc_v) {
      this.vc_diffs_set(this.vc_count, diff ? 1 : 0)
      this.vc_counts[this.vc_count] = count
      this.vc_count++
    } else {
      this.flush_vlink()
      this.vc_v = v
      this.vc_diffs_set(0, diff ? 1 : 0)
      this.vc_counts[0] = count
      this.vc_count = 1
    }
  }

  flush_klink() {
    if (this.kc_v === null) return
    if (this.kc_count < 4) {
      for (let i = 0; i < this.kc_count; i++)
        this._flush_klink(
          this.kc_v,
          this.kc_diffs_get(i) === 1,
          this.kc_counts[i],
        )
    } else {
      if (this.kc_diffs_get(0) === 1) {
        this.add_klinks(0, 3)
        this.short_klinks(this.kc_count)
        this.add_klinks(this.kc_v + 1, 3)
      } else {
        const nb = this.set_newbits_k(this.kc_counts[0])
        this.add_klinks(0, nb)
        this.short_klinks(this.kc_count)
        this.add_klinks(this.kc_v + 1, nb)
      }
    }
  }

  _flush_klink(v, diff, count) {
    if (diff) {
      this.add_klinks(v + 1, 3)
    } else {
      const nb = this.set_newbits_k(count)
      this.add_klinks(v + 1, nb)
    }
  }

  _push_klink(v, diff, count) {
    if (this.kc_v === null) {
      this.kc_v = v
      this.kc_diffs_set(0, diff ? 1 : 0)
      this.kc_counts[0] = count
      this.kc_count = 1
    } else if (v === this.kc_v) {
      this.kc_diffs_set(this.kc_count, diff ? 1 : 0)
      this.kc_counts[this.kc_count] = count
      this.kc_count++
    } else {
      this.flush_klink()
      this.kc_v = v
      this.kc_diffs_set(0, diff ? 1 : 0)
      this.kc_counts[0] = count
      this.kc_count = 1
    }
  }

  push_type(v) {
    let count = this.tcount
    if (count > 3) {
      this.add_types(0, 3)
      this.short_types(count)
      this.add_types(v, 3)
    } else for (let i = 0; i < count; i++) this.add_types(v, 3)
    this.tcount = 1
  }

  push_keylen(v) {
    this.short_keys(v)
  }

  push_int(v) {
    let result = this.get_diff(v, this.prev_num)
    const isDiff = (result & 1) === 1
    const v2 = result >>> 1

    this.prev_num = v
    this.dint(v2, isDiff)
  }

  push_float(neg, v) {
    if (v < 4) this.push_int(neg ? 4 + v : v)
    else this.push_int(neg ? 4 : 0)
  }

  flush_nums() {
    if (this.nc_diff !== null) {
      if (this.nc_count < 3) {
        for (let i = 0; i < this.nc_count; i++)
          this._dint(this.nc_v, this.nc_diff)
      } else {
        this.add_nums(0, 2)
        this.add_nums(7, 3)
        this.short_nums(this.nc_count)
        if (this.nc_diff) {
          this.add_nums(0, 2)
          this.add_nums(this.nc_v, 3)
        } else if (this.nc_v < 64) {
          const d = this.nc_v < 16 ? 4 : 6
          const flag = this.nc_v < 16 ? 1 : 2
          this.add_nums(flag, 2)
          this.add_nums(this.nc_v, d)
        } else this.leb128_nums(this.nc_v)
      }
    }
  }

  dint(v, diff = false) {
    if (this.nc_diff === null) {
      this.nc_diff = diff
      this.nc_v = v
      this.nc_count = 1
    } else if (this.nc_diff === diff && this.nc_v === v) {
      this.nc_count += 1
    } else {
      if (this.nc_count === 1) this._dint(this.nc_v, this.nc_diff)
      else this.flush_nums()
      this.nc_diff = diff
      this.nc_v = v
      this.nc_count = 1
    }
  }

  _dint(v, diff) {
    if (diff) {
      this.add_nums(0, 2)
      this.add_nums(v, 3)
    } else if (v < 64) {
      const d = v < 16 ? 4 : 6
      const flag = v < 16 ? 1 : 2
      this.add_nums(flag, 2)
      this.add_nums(v, d)
    } else this.leb128_nums(v)
  }

  leb128_2_kvals(v) {
    while (v >= 128) {
      this.add_kvals((v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add_kvals(v, 8)
  }

  leb128_dc(v) {
    this.add_dc(3, 2)
    while (v >= 128) {
      this.add_dc((v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add_dc(v, 8)
  }

  leb128_keys(v) {
    this.add_keys(3, 2)
    while (v >= 128) {
      this.add_keys((v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add_keys(v, 8)
  }

  leb128_klinks(v) {
    this.add_klinks(3, 2)
    while (v >= 128) {
      this.add_klinks((v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add_klinks(v, 8)
  }

  leb128_vals(v) {
    this.add_vals(3, 2)
    while (v >= 128) {
      this.add_vals((v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add_vals(v, 8)
  }

  leb128_kvals(v) {
    this.add_kvals(3, 2)
    while (v >= 128) {
      this.add_kvals((v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add_kvals(v, 8)
  }

  leb128_nums(v) {
    this.add_nums(3, 2)
    while (v >= 128) {
      this.add_nums((v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add_nums(v, 8)
  }

  leb128_types(v) {
    this.add_types(3, 2)
    while (v >= 128) {
      this.add_types((v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add_types(v, 8)
  }

  leb128_vlinks(v) {
    this.add_vlinks(3, 2)
    while (v >= 128) {
      this.add_vlinks((v & 0x7f) | 0x80, 8)
      v >>>= 7
    }
    this.add_vlinks(v, 8)
  }

  uint_dc(v) {
    if (v < 64) {
      const d = v < 8 ? 3 : v < 16 ? 4 : 6
      const flag = v < 8 ? 0 : v < 16 ? 1 : 2
      this.add_dc(flag, 2)
      this.add_dc(v, d)
    } else this.leb128_dc(v)
  }

  short_types(v) {
    if (v < 16) {
      const d = v < 4 ? 2 : this.fastBits(v)
      this.add_types(d - 2, 2)
      this.add_types(v, d)
    } else this.leb128_types(v)
  }

  short_dc(v) {
    if (v < 16) {
      const d = v < 4 ? 2 : this.fastBits(v)
      this.add_dc(d - 2, 2)
      this.add_dc(v, d)
    } else this.leb128_dc(v)
  }

  short_vals(v) {
    if (v < 16) {
      const d = v < 4 ? 2 : this.fastBits(v)
      this.add_vals(d - 2, 2)
      this.add_vals(v, d)
    } else this.leb128_vals(v)
  }

  short_kvals(v) {
    if (v < 16) {
      const d = v < 4 ? 2 : this.fastBits(v)
      this.add_kvals(d - 2, 2)
      this.add_kvals(v, d)
    } else this.leb128_kvals(v)
  }

  short_keys(v) {
    if (v < 16) {
      const d = v < 4 ? 2 : this.fastBits(v)
      this.add_keys(d - 2, 2)
      this.add_keys(v, d)
    } else this.leb128_keys(v)
  }

  short_klinks(v) {
    if (v < 16) {
      const d = v < 4 ? 2 : this.fastBits(v)
      this.add_klinks(d - 2, 2)
      this.add_klinks(v, d)
    } else this.leb128_klinks(v)
  }

  short_vlinks(v) {
    if (v < 16) {
      const d = v < 4 ? 2 : this.fastBits(v)
      this.add_vlinks(d - 2, 2)
      this.add_vlinks(v, d)
    } else this.leb128_vlinks(v)
  }

  reset() {
    this.strMap.clear()
    this.str_len = 0
    this.prev_bits = 1
    this.prev_kbits = 1
    this.prev_num = 0
    this.nums_count = 0
    this.prev_link = null
    this.prev_klink = null
    this.single = true
    this.len = 0
    this.dlen = 0
    this.jlen = 0
    this.dcount = 0
    this.rcount = 0
    this.tcount = 0
    this.oid = 0
    this.iid = 0

    this.vc_v = null

    this.vc_count = null

    this.kc_v = null

    this.kc_count = null

    this.nc_diff = null
    this.nc_v = null
    this.nc_count = null

    this.vlinks_len = 0
    this.klinks_len = 0
    this.vflags_len = 0
    this.kflags_len = 0
    this.bools_len = 0
    this.keys_len = 0
    this.types_len = 0
    this.nums_len = 0
    this.dc_len = 0
    this.kvals_len = 0
    this.vals_len = 0
  }

  dump() {
    if (!this.single) {
      this.flush_vlink()
      this.flush_klink()
      this.flush_nums()
      this.add_dc(this.single ? 1 : 0, 1)
      this.short_dc(this.rcount)
    }

    const totalBits =
      this.dc_len +
      this.vflags_len +
      this.vlinks_len +
      this.kflags_len +
      this.klinks_len +
      this.keys_len +
      this.types_len +
      this.nums_len +
      this.bools_len +
      this.kvals_len +
      this.vals_len

    const padBits = (8 - (totalBits % 8)) % 8
    const finalBits = totalBits + padBits
    const outLength = finalBits / 8
    const out = new Uint8Array(outLength)

    let outIndex = 0
    let accumulator = 0
    let accBits = 0

    const writeBits = (num, numBits) => {
      while (numBits > 0) {
        const free = 8 - accBits
        if (numBits <= free) {
          accumulator = (accumulator << numBits) | (num & ((1 << numBits) - 1))
          accBits += numBits
          numBits = 0
          if (accBits === 8) {
            out[outIndex++] = accumulator
            accumulator = 0
            accBits = 0
          }
        } else {
          const shift = numBits - free
          const part = num >>> shift
          accumulator = (accumulator << free) | (part & ((1 << free) - 1))
          out[outIndex++] = accumulator
          num = num & ((1 << shift) - 1)
          numBits -= free
          accumulator = 0
          accBits = 0
        }
      }
    }

    const writeBuffer = (buffer, bitLen) => {
      let remaining = bitLen
      let i = 0
      while (remaining > 0 && i < buffer.length) {
        const bitsThis = Math.min(32, remaining)
        writeBits(buffer[i] >>> 0, bitsThis)
        remaining -= bitsThis
        i++
      }
    }

    writeBuffer(this.dc, this.dc_len)
    writeBuffer(this.vflags, this.vflags_len)
    writeBuffer(this.vlinks, this.vlinks_len)
    writeBuffer(this.kflags, this.kflags_len)
    writeBuffer(this.klinks, this.klinks_len)
    writeBuffer(this.keys, this.keys_len)
    writeBuffer(this.types, this.types_len)
    writeBuffer(this.bools, this.bools_len)
    writeBuffer(this.nums, this.nums_len)
    writeBuffer(this.kvals, this.kvals_len)
    writeBuffer(this.vals, this.vals_len)

    if (padBits > 0) writeBits(0, padBits)

    return out
  }
}

function pushPathStr(u, v2, prev = null) {
  if (u.dcount > 0) u.push_klink(prev === null ? 0 : prev + 1)
  if (u.strMap.has(v2)) {
    u.add_keys(2, 2)
    u.push_keylen(0)
    u.short_kvals(u.strMap.get(v2))
  } else {
    u.strMap.set(v2, u.str_len++)
    const len = v2.length
    let ktype = 3
    let codes = []
    let codes2 = []
    if (len !== 0) {
      let is64 = true
      for (let i = 0; i < len; i++) {
        codes2.push(v2.charCodeAt(i))
        const c = base64[v2[i]]
        if (typeof c === "undefined") is64 = false
        else codes.push(c)
      }
      if (is64) ktype = 2
    }
    u.add_keys(ktype, 2)
    u.push_keylen(len + 2)
    if (ktype === 3) for (let v of codes2) u.leb128_2_kvals(v)
    else for (let v of codes) u.add_kvals(v, 6)
  }
  u.dcount++
}

function pushPathNum(u, prev = null, keylen) {
  if (u.dcount > 0) u.push_klink(prev === null ? 0 : prev + 1)
  u.add_keys(keylen, 2)
  const id = keylen === 0 ? u.iid++ : u.oid++
  u.dcount++
}

function encode_x(v, u) {
  u.reset()
  if (v === null) {
    u.add_dc(1, 1)
    u.add_dc(0, 7)
  } else if (typeof v !== "object") {
    u.add_dc(1, 1)
    if (v === true) u.add_dc(1, 7)
    else if (v === false) u.add_dc(2, 7)
    else if (v === "") u.add_dc(3, 7)
    else if (typeof v === "number") {
      const moved = v % 1 === v ? 0 : getPrecision(v)
      const type = moved === 0 ? (v < 0 ? 5 : 4) : v < 0 ? 7 : 6
      if (type === 4) {
        u.add_dc(1, 1)
        if (v < 63) u.add_dc(v, 6)
        else {
          u.add_dc(63, 6)
          u.leb128_2_dc(v - 63)
        }
      } else {
        u.add_dc(0, 1)
        u.add_dc(type + 1, 6)
        if (moved > 0) u.uint_dc(moved)
        u.uint_dc((v < 0 ? -1 : 1) * v * Math.pow(10, moved))
      }
    } else if (typeof v === "string") {
      u.add_dc(0, 1)

      if (v.length === 1) {
        const charCode = v.charCodeAt(0)
        const mapValue = strmap[v]

        if (typeof mapValue !== "undefined") {
          u.add_dc(mapValue + 9, 6)
        } else {
          u.add_dc(61, 6)
          u.leb128_2_dc(charCode)
        }
      } else {
        let is64 = true
        for (let i = 0; i < v.length; i++) {
          if (typeof base64[v[i]] === "undefined") {
            is64 = false
            break
          }
        }

        if (is64) {
          u.add_dc(62, 6)
          u.short_dc(v.length)
          for (let i = 0; i < v.length; i++) {
            u.add_dc(base64[v[i]], 6)
          }
        } else {
          u.add_dc(63, 6)
          u.short_dc(v.length)
          for (let i = 0; i < v.length; i++) {
            u.leb128_2_dc(v.charCodeAt(i))
          }
        }
      }
    }
  } else if (Array.isArray(v) && v.length === 0) {
    u.add_dc(1, 1)
    u.add_dc(4, 7)
  } else if (Object.keys(v).length === 0) {
    u.add_dc(1, 1)
    u.add_dc(5, 7)
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

function _encode_x(
  v,
  u,
  plen = 0,
  prev = null,
  prev_type = null,
  index = null,
) {
  if (typeof v === "number") {
    if (prev !== null) u.push_vlink(prev + 1)

    const moved = v % 1 === v ? 0 : getPrecision(v)
    const type = moved === 0 ? (v < 0 ? 5 : 4) : 6

    if (prev_type !== null && prev_type !== 4) u.push_type(prev_type)
    else u.tcount++
    if (moved > 0) {
      u.push_float(v < 0, moved + 1)
      if (moved > 2) u.push_int(moved + 1)
    }
    u.push_int((v < 0 ? -1 : 1) * v * Math.pow(10, moved))
    return type
  } else if (typeof v === "boolean") {
    if (prev !== null) u.push_vlink(prev + 1)
    const type = 3
    if (prev_type !== null && prev_type !== type) u.push_type(prev_type)
    else u.tcount++
    u.push_bool(v)
    return type
  } else if (v === null) {
    if (prev !== null) u.push_vlink(prev + 1)
    if (prev_type !== null && prev_type !== 1) u.push_type(prev_type)
    else u.tcount++
    return 1
  } else if (typeof v === "string") {
    let ktype = 7
    if (prev !== null) u.push_vlink(prev + 1)
    if (u.strMap.has(v)) {
      ktype = 2
      u.push_type(prev_type)
      u.short_vals(0)
      u.short_vals(u.strMap.get(v))
    } else {
      u.strMap.set(v, u.str_len++)
      const len = v.length
      u.short_vals(len)
      let codes = []
      let codes2 = []
      let is64 = true
      if (len === 0) {
        is64 = false
      } else {
        for (let i = 0; i < len; i++) {
          codes2.push(v.charCodeAt(i))
          const c = base64[v[i]]
          if (typeof c === "undefined") is64 = false
          else codes.push(c)
        }
        if (is64) ktype = 2
      }
      if (prev_type !== null && prev_type !== ktype) u.push_type(prev_type)
      else u.tcount++

      if (is64) for (let v of codes) u.add_vals(v, 6)
      else for (let v of codes2) u.leb128_2_vals(v)
    }
    return ktype
  } else if (Array.isArray(v)) {
    if (v.length === 0) {
      if (prev !== null) u.push_vlink(prev + 1)
      u.push_type(prev_type)
      u.push_float(false, 1)
      return 6
    } else {
      const _prev = u.dcount
      pushPathNum(u, prev, 0)
      let i = 0
      for (const v2 of v) {
        prev_type = _encode_x(v2, u, plen + 1, _prev, prev_type, i)
        i++
      }
    }
    return prev_type
  } else if (typeof v === "object") {
    if (Object.keys(v).length === 0) {
      if (prev !== null) u.push_vlink(prev + 1)
      u.push_type(prev_type)
      u.push_float(true, 1)
      return 6
    } else {
      pushPathNum(u, prev, 1)
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
