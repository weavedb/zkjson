import { clone, isNil, includes, splitEvery, flatten } from "ramda"
const ops = {
  $eq: 10,
  $ne: 11,
  $gt: 12,
  $gte: 13,
  $lt: 14,
  $lte: 15,
  $in: 16,
  $nin: 17,
  $contains: 18,
  $contains_any: 19,
  $contains_all: 20,
  $contains_none: 21,
}
const opMap = {}
for (let k in ops) opMap[ops[k]] = k

const base64Map = {
  A: "00",
  B: "01",
  C: "02",
  D: "03",
  E: "04",
  F: "05",
  G: "06",
  H: "07",
  I: "08",
  J: "09",
  K: "10",
  L: "11",
  M: "12",
  N: "13",
  O: "14",
  P: "15",
  Q: "16",
  R: "17",
  S: "18",
  T: "19",
  U: "20",
  V: "21",
  W: "22",
  X: "23",
  Y: "24",
  Z: "25",
  a: "26",
  b: "27",
  c: "28",
  d: "29",
  e: "30",
  f: "31",
  g: "32",
  h: "33",
  i: "34",
  j: "35",
  k: "36",
  l: "37",
  m: "38",
  n: "39",
  o: "40",
  p: "41",
  q: "42",
  r: "43",
  s: "44",
  t: "45",
  u: "46",
  v: "47",
  w: "48",
  x: "49",
  y: "50",
  z: "51",
  0: "52",
  1: "53",
  2: "54",
  3: "55",
  4: "56",
  5: "57",
  6: "58",
  7: "59",
  8: "60",
  9: "61",
  "-": "62",
  _: "63",
}

let strMap = {}
for (const k in base64Map) strMap[base64Map[k]] = k

function pad(arr, max = 0) {
  arr = arr.map(n => n.toString())
  for (let i = arr.length; i < max; i++) {
    arr.push("0")
  }
  return arr
}

function encodePath(path) {
  const parts = []
  let str = ""
  let num = 0
  for (const s of path) {
    if (num == 2 && !(s == "." || s == "[")) throw Error()
    if (s == ".") {
      if (num == 2) {
        num = 0
      } else {
        parts.push(str)
        str = ""
      }
    } else if (s == "[") {
      if (num != 2) {
        if (str != "" || parts.length > 0) parts.push(str)
        str = ""
      }
      num = 1
    } else if (s == "]") {
      if (num != 1) throw Error()
      num = 2
      if (str == "" || Number.isNaN(+str)) throw Error()
      parts.push(+str)
      str = ""
    } else {
      str += s
    }
  }
  if (str != "") parts.push(str)
  if (parts.length == 0) parts.push("")
  let encoded = [parts.length]
  for (const p of parts) {
    if (typeof p == "number") {
      encoded = encoded.concat([0, 0, p])
    } else {
      let plen = [p.length]
      if (p.length == 0) plen.push(1)
      encoded = encoded.concat([
        ...plen,
        ...p.split("").map(c => c.charCodeAt(0)),
      ])
    }
  }
  return encoded
}

function decodePath(path) {
  let str = ""
  let p = []
  let len = path.shift()
  while (path.length > 0) {
    const type = path.shift()
    let val = null
    if (type == 0) {
      const type2 = path.shift()
      if (type2 == 0) {
        val = [type2, path.shift()]
      } else {
        val = [type2]
      }
    } else {
      val = []
      for (let i = 0; i < type; i++) {
        val.push(path.shift())
      }
    }
    p.push([type, ...val])
  }
  let i = 0
  for (let s of p) {
    if (s[0] == 0 && s[1] == 0) {
      str += `[${s[2]}]`
    } else if (s[0] == 0 && s[1] == 1) {
      if (str != "") str += "."
    } else {
      str += `${i == 0 ? "" : "."}${s
        .slice(1)
        .map(c => String.fromCharCode(Number(c)))
        .join("")}`
    }
    i++
  }
  return str
}

function flattenPath(path) {
  let p = [path.length]
  for (const v of path) {
    p = p.concat(v)
  }
  return p
}

function _encode(v, path = []) {
  let vals = []
  if (typeof v == "number") {
    vals.push([path, encodeVal(v)])
  } else if (typeof v == "boolean") {
    vals.push([path, encodeVal(v)])
  } else if (v == null) {
    vals.push([path, encodeVal(v)])
  } else if (typeof v == "string") {
    vals.push([path, encodeVal(v)])
  } else if (Array.isArray(v)) {
    let i = 0
    for (const v2 of v) {
      for (const v3 of _encode(v2, [...path, [0, 0, i]])) vals.push(v3)
      i++
    }
  } else if (typeof v == "object") {
    for (const k in v) {
      const key = k.split("").map(c => c.charCodeAt(0))
      for (let v4 of _encode(v[k], [
        ...path,
        [key.length, ...(key.length == 0 ? [1] : key)],
      ])) {
        vals.push(v4)
      }
    }
  }
  return vals
}

function encode(json) {
  let flattened = _encode(json)
  flattened.sort((a, b) => {
    const isUndefined = v => typeof v == "undefined"
    const max = Math.max(a[0].length, b[0].length)
    if (max > 0) {
      for (let i = 0; i < max; i++) {
        const exA = !isUndefined(a[0][i])
        const exB = !isUndefined(b[0][i])
        if (exA && !exB) return 1
        if (!exA && exB) return -1
        const max2 = Math.max(a[0][i].length, b[0][i].length)
        if (max2 > 0) {
          for (let i2 = 0; i2 < max2; i2++) {
            const vA = a[0][i][i2]
            const vB = b[0][i][i2]
            const exA = !isUndefined(vA)
            const exB = !isUndefined(vB)
            if (exA && !exB) return 1
            if (!exA && exB) return -1
            if (vA > vB) return 1
            if (vA < vB) return -1
          }
        }
      }
    }
    return 0
  })

  return flattened.reduce(
    (arr, v) => arr.concat([...flattenPath(v[0]), ...v[1]]),
    [],
  )
}

function _decode(arr) {
  let vals = []
  while (arr.length > 0) {
    let plen = arr.shift()
    let keys = []
    let val = null
    while (plen > 0) {
      const plen2 = arr.shift()
      if (plen2 == 0) {
        const plen3 = arr.shift()
        if (plen3 == 1) {
          keys.push([plen2, plen3])
        } else {
          keys.push([plen2, plen3, arr.shift()])
        }
      } else if (plen2 != 0) {
        const plen3 = plen2
        let key = []
        for (let i2 = 0; i2 < plen3; i2++) key.push(arr.shift())
        keys.push([plen2, ...key])
      }
      plen--
    }
    const type = arr.shift()
    val = [type]
    if (type == 2) {
      val.push(arr.shift())
      val.push(arr.shift())
      val.push(arr.shift())
    } else if (type == 1) {
      val.push(arr.shift())
    } else if (type == 3) {
      const strlen = arr.shift()
      val.push(strlen)
      for (let i2 = 0; i2 < strlen; i2++) val.push(arr.shift())
    }
    vals.push([keys, val])
  }
  return vals
}

function encodeVal(v) {
  let vals = []
  if (typeof v == "number" || typeof v == "bigint") {
    const int = Number.isInteger(v)
    let moved = 0
    let num = v
    while (num % 1 != 0) {
      num *= 10
      moved += 1
    }
    vals = v < 0 ? [2, 0, moved, -num] : [2, 1, moved, num]
  } else if (typeof v == "boolean") {
    vals = [1, v ? 1 : 0]
  } else if (v == null) {
    vals = [0]
  } else if (typeof v == "string") {
    vals = [3, v.length, ...v.split("").map(c => c.charCodeAt(0))]
  } else {
    vals = [4, ...encode(v)]
  }
  return vals
}

function decodeVal(arr) {
  const type = arr[0]
  const _val = arr[1]
  let val = null
  if (type == 0) {
    val = null
  } else if (type == 1) {
    val = arr[1] ? true : false
  } else if (type == 2) {
    val = (arr[1] == 0 ? -1 : 1) * arr[3]
    for (let i = 0; i < arr[2]; i++) {
      val /= 10
    }
  } else if (type == 3) {
    val = arr
      .slice(2)
      .map(c => String.fromCharCode(Number(c)))
      .join("")
  } else if (type == 4) {
    val = decode(arr.slice(1))
  }
  return val
}

function decode(arr) {
  const decoded = _decode(clone(arr))
  let json =
    decoded[0]?.[0]?.[0]?.[0] == 0 && decoded[0]?.[0]?.[0]?.[1] == 0 ? [] : {}
  for (const v of decoded) {
    const keys = v[0].map(v2 => {
      if (v2[0] == 0) {
        if (v2[1] == 1) return ""
        return v2[2]
      } else {
        return v2
          .slice(1)
          .map(c => String.fromCharCode(Number(c)))
          .join("")
      }
    })
    if (keys.length == 0) {
      json = decodeVal(v[1])
    } else {
      let obj = json
      let i = 0
      for (const k of keys) {
        if (typeof k == "number") {
          if (typeof keys[i + 1] == "undefined") {
            obj[k] = decodeVal(v[1])
          } else {
            if (typeof obj[k] == "undefined") {
              if (typeof keys[i + 1] == "string") {
                obj[k] = {}
              } else {
                obj[k] = []
              }
            }
          }
        } else {
          if (typeof obj[k] == "undefined") {
            if (typeof keys[i + 1] == "undefined") {
              obj[k] = decodeVal(v[1])
            } else if (typeof keys[i + 1] == "string") {
              obj[k] = {}
            } else {
              obj[k] = []
            }
          }
        }
        obj = obj[k]
        i++
      }
    }
  }
  return json
}

function toIndex(rawStr) {
  const b64url = Buffer.from(rawStr, "utf8").toString("base64url")
  const bi = BigInt("0x" + Buffer.from(b64url, "base64url").toString("hex"))
  return bi.toString(10)
}

function fromIndex(idxStr) {
  const bi = BigInt(idxStr)
  let hex = bi.toString(16)
  if (hex.length % 2) hex = "0" + hex
  const buf = Buffer.from(hex, "hex")
  const b64url = buf.toString("base64url")
  return Buffer.from(b64url, "base64url").toString("utf8")
}

function toSignal(arr) {
  const _arr = flatten(
    arr.map(n => {
      let str = splitEvery(8, n.toString().split(""))
      let i = 0
      str = str.map(s => {
        const len = i == str.length - 1 ? s.length : 9
        i++
        return len.toString() + s.join("")
      })
      return str
    }),
  )
  let _arr2 = []
  let one = 0
  let i = 0
  let start = null
  for (let v of _arr) {
    _arr2.push(v)
    if (v.length - 1 == 1) {
      if (start == null) start = i
      one += v.length - 1
      if (one == 9) {
        _arr2[start] = `0${one}${_arr2[start][1]}`
        for (let i2 = start + 1; i2 <= i; i2++) _arr2[i2] = `${_arr2[i2][1]}`
        one = 0
        start = null
      }
    } else {
      if (one > 2) {
        _arr2[start] = `0${one}${_arr2[start][1]}`
        for (let i2 = start + 1; i2 < i; i2++) _arr2[i2] = `${_arr2[i2][1]}`
      }
      one = 0
      start = null
    }
    i++
  }
  if (one > 2) {
    _arr2[start] = `0${one}${_arr2[start][1]}`
    for (let i2 = start + 1; i2 <= i - 1; i2++) _arr2[i2] = `${_arr2[i2][1]}`
  }
  let _arr3 = []
  let chain = null
  let cur = 0
  let num = ""
  for (let v of _arr2) {
    if (chain == null && +v[0] == 0) {
      chain = +v[1]
      cur = 1
      num = v
    } else if (chain != null) {
      num += v
      cur++
      if (chain == cur) {
        _arr3.push(num)
        chain = null
        num = ""
        cur = 0
      }
    } else {
      _arr3.push(v)
    }
  }
  if (chain != null) _arr3.push(num)
  let arrs2 = []
  let len2 = 0
  let str2 = ""
  for (let v of _arr3) {
    if (len2 + v.length > 75) {
      arrs2.push("1" + str2)
      if (+v[0] == 0) {
        let len3 = 75 - len2
        if (len3 == 2 || len3 == 3) {
          arrs2[arrs2.length - 1] += `1${v[2]}`
          let new_len = +v[1] - 1
          if (new_len == 2) {
            v = `1${v[3]}1${v[4]}`
          } else {
            v = `0${new_len}${v.slice(3)}`
          }
        } else if (len3 > 3) {
          let new_len = +v[1] - 2
          let old_len = 2
          if (len3 == 4) {
            arrs2[arrs2.length - 1] += `1${v[2]}1${v[3]}`
          } else {
            old_len = len3 - 2
            new_len = +v[1] - old_len
            arrs2[arrs2.length - 1] += `0${old_len}${v.slice(2, 2 + old_len)}`
          }
          if (new_len == 1) {
            v = `1${v[old_len + 2]}`
          } else if (new_len == 2) {
            v = `1${v[old_len + 2]}1${v[old_len + 3]}`
          } else {
            v = `0${new_len}${v.slice(old_len + 2)}`
          }
        }
      }
      len2 = 0
      str2 = ""
    }
    len2 += v.length
    str2 += v
  }
  if (str2 != "") arrs2.push("1" + str2)
  return arrs2
}

function fromSignal(arr) {
  let _arr = []
  let prev = ""
  for (let s of arr) {
    s = s.slice(1)
    let str = s.split("")
    while (str.length > 0) {
      const len = +str.shift()
      if (len == 0) {
        const len2 = +str.shift()
        for (let i2 = 0; i2 < len2; i2++) {
          _arr.push(+str[i2])
        }
        str = str.slice(len2)
      } else if (len == 9) {
        prev += str.slice(0, 8).join("")
        str = str.slice(8)
      } else {
        const nums = str.slice(0, len).join("")
        str = str.slice(len)
        _arr.push(+(prev + nums))
        prev = ""
      }
    }
  }
  return _arr
}

const path = p => toSignal(encodePath(p))
const val = v => toSignal(encodeVal(v))
const query = v => toSignal(encodeQuery(v))

function encodeQuery(v) {
  if (!Array.isArray(v)) throw Error("query must be an array")
  const op = v[0]
  if (isNil(ops[op])) throw Error(`query not supported: ${op}`)
  return [ops[op], ...encodeVal(v[1])]
}

function decodeQuery(v) {
  const op = opMap[v[0]]
  if (isNil(op)) throw Error("op doens't exist")
  return [op, decodeVal(v.slice(1))]
}

export {
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
  pad,
  _encode,
  flattenPath,
  toSignal,
  fromSignal,
  toIndex,
  fromIndex,
  path,
  val,
  query,
  encodeQuery,
  decodeQuery,
}
