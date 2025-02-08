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
    if (s[0] == 0 && s[1] == 0) str += `[${s[2]}]`
    else if (s[0] == 0 && s[1] == 1) {
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
  for (const v of path) p = p.concat(v)
  return p
}

function _encode(v, path = []) {
  let vals = []
  if (typeof v == "number") vals.push([path, encodeVal(v)])
  else if (typeof v == "boolean") vals.push([path, encodeVal(v)])
  else if (v == null) vals.push([path, encodeVal(v)])
  else if (typeof v == "string") vals.push([path, encodeVal(v)])
  else if (Array.isArray(v)) {
    let i = 0
    for (const v2 of v) {
      for (const v3 of _encode(v2, [...path, i])) vals.push(v3)
      i++
    }
  } else if (typeof v == "object") {
    for (const k in v) for (let v4 of _encode(v[k], [...path, k])) vals.push(v4)
  }
  return vals
}

const filterDic = keys => keys.filter(entry => entry.count > 1)

function countKeys(keys) {
  let keys2 = []
  for (let v of keys) {
    let i = 0
    for (let v2 of v) {
      const _key = v.slice(0, i + 1)
      let exists = false
      for (let v3 of keys2) {
        if (equals(_key, v3.key)) {
          v3.count += 1
          exists = true
        }
      }
      if (!exists) keys2.push({ key: _key, count: 1 })
      i++
    }
  }
  return keys2
}

function sortKeys(keys) {
  return keys.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    for (let i = 0; i < Math.min(a.key.length, b.key.length); i++) {
      const aVal = a.key[i]
      const bVal = b.key[i]
      if (typeof aVal === "number" && typeof bVal === "string") return -1
      if (typeof aVal === "string" && typeof bVal === "number") return 1
      if (aVal < bVal) return -1
      if (aVal > bVal) return 1
    }

    return a.key.length - b.key.length
  })
}

function buildDic(data) {
  // --- Step 1. (Optional) Save original input order if needed.
  data.forEach((entry, idx) => (entry._origIdx = idx))

  // --- Step 2. Sort the data in "dictionary order."
  // Primary: by key array length (shorter arrays come first).
  // Secondary: for keys of equal length, by the total character length (ascending)
  //   so that, for example, ["jane"] (4 chars) comes before ["alice"] (5 chars).
  // Tertiary: if still equal, compare element-by-element using natural order.
  data.sort((a, b) => {
    const keyA = a.key
    const keyB = b.key

    // Primary: Compare array lengths.
    if (keyA.length !== keyB.length) return keyA.length - keyB.length

    // Secondary: Compare total character lengths (ascending).
    const totalA = keyA.reduce((acc, x) => acc + x.toString().length, 0)
    const totalB = keyB.reduce((acc, x) => acc + x.toString().length, 0)
    if (totalA !== totalB) return totalA - totalB
    // Tertiary: Compare element-by-element using natural order.
    for (let i = 0; i < keyA.length; i++) {
      const elA = keyA[i]
      const elB = keyB[i]

      if (typeof elA === typeof elB) {
        if (typeof elA === "number") {
          if (elA !== elB) return elA - elB
        } else if (typeof elA === "string") {
          const cmp = elA.localeCompare(elB, undefined, { numeric: true })
          if (cmp !== 0) return cmp
        } else {
          // Fallback: compare string representations.
          const cmp = elA
            .toString()
            .localeCompare(elB.toString(), undefined, { numeric: true })
          if (cmp !== 0) return cmp
        }
      } else {
        // If types differ, compare string representations.
        const cmp = elA
          .toString()
          .localeCompare(elB.toString(), undefined, { numeric: true })
        if (cmp !== 0) return cmp
      }
    }

    return 0
  })

  // --- Step 3. Build the dictionary.
  // Each dictionary entry will be stored as an object with:
  // - original: the original key (an array)
  // - compressed: the computed compressed representation.
  const dict = []

  // Helper: For a given string, look for a previously defined simple key (an array of length 1).
  function getPointerIndex(str) {
    for (let i = 0; i < dict.length; i++) {
      if (dict[i].original.length === 1 && dict[i].original[0] === str) return i
    }
    return -1
  }

  // Helper: Element-by-element compression.
  // For each element in a composite key, if it is a string that already exists as a simple key,
  // replace one or more consecutive occurrences with a pointer.
  // A single occurrence becomes [dictIndex]; a group becomes [dictIndex, 0].
  function compressElementByElement(key) {
    const rep = []
    let i = 0
    while (i < key.length) {
      const el = key[i]
      if (typeof el === "string") {
        const ptrIndex = getPointerIndex(el)
        if (ptrIndex !== -1) {
          let j = i
          while (j < key.length && key[j] === el) {
            j++
          }
          const groupLen = j - i
          rep.push(groupLen === 1 ? [ptrIndex] : [ptrIndex, 0])
          i = j
          continue
        }
      }
      rep.push(el)
      i++
    }
    return rep
  }

  // Helper: Compute a "cost" for a given representation.
  // Each literal (number or string) counts as 1; a pointer array counts as the number of numbers it holds.
  function computeCost(rep) {
    let cost = 0
    for (const token of rep) cost += Array.isArray(token) ? token.length : 1
    return cost
  }

  // Helper: Full segmentation compression.
  // Try to segment the entire key as a concatenation of one or more previously defined dictionary entries.
  // Uses dynamic programming over the key array.
  // Returns an object { cost, seg } where seg is an array of dictionary indices.
  function segmentKey(key) {
    const n = key.length
    const dp = Array(n + 1).fill(null)
    dp[n] = { cost: 0, seg: [] }

    for (let i = n - 1; i >= 0; i--) {
      let best = null
      // Try every dictionary entry.
      for (let d = 0; d < dict.length; d++) {
        const candidate = dict[d].original
        const m = candidate.length
        if (i + m <= n) {
          let match = true
          for (let k = 0; k < m; k++) {
            if (key[i + k] !== candidate[k]) {
              match = false
              break
            }
          }
          if (match && dp[i + m] !== null) {
            const candidateCost = 1 + dp[i + m].cost // cost 1 for using this pointer.
            if (best === null || candidateCost < best.cost) {
              best = { cost: candidateCost, seg: [d].concat(dp[i + m].seg) }
            }
          }
        }
      }
      dp[i] = best
    }
    return dp[0]
  }

  // Process each entry (in the sorted, deterministic order).
  for (const entry of data) {
    const key = entry.key
    let compressed
    if (key.length === 1) {
      // For simple keys, copy as-is.
      compressed = key.slice()
    } else {
      // Try element-by-element compression.
      const repA = compressElementByElement(key)
      let bestCost = computeCost(repA)
      let bestRep = repA

      // Also try full segmentation over the entire key.
      const segRes = segmentKey(key)
      if (segRes !== null) {
        const repB = [segRes.seg] // Represent segmentation as a pointer.
        const costB = segRes.cost
        if (costB < bestCost) {
          bestCost = costB
          bestRep = repB
        }
      }

      // Now try partial segmentation: try segmenting a prefix and then appending the literal remainder.
      const n = key.length
      for (let i = 1; i < n; i++) {
        const prefixSeg = segmentKey(key.slice(0, i))
        if (prefixSeg !== null) {
          const literalPart = key.slice(i)
          const candidateCost = prefixSeg.cost + computeCost(literalPart)
          if (candidateCost < bestCost) {
            bestCost = candidateCost
            // Build candidate representation: pointer for the segmented prefix followed by literal remainder.
            bestRep = [prefixSeg.seg].concat(literalPart)
          }
        }
      }

      compressed = bestRep
    }
    dict.push({ original: key, compressed })
  }

  // --- Step 4. Return the dictionary and key map.
  // "dictionary" is an array of compressed keys.
  // "keyMap" is the array of original keys (in the same, deterministic order).
  return {
    dictionary: dict.map(entry => {
      return entry.compressed.length === 1 && !is(Array, entry.compressed[0])
        ? entry.compressed[0]
        : entry.compressed
    }),
    keyMap: dict.map(entry => entry.original),
  }
}
const genDic = compose(buildDic, filterDic, sortKeys, countKeys, listKeys)

function listKeys(v, key = [], keys = []) {
  if (Array.isArray(v)) {
    let i = 0
    for (const v2 of v) {
      listKeys(v2, append(i, key), keys)
      i++
    }
  } else if (typeof v == "object") {
    for (const k in v) listKeys(v[k], append(k, key), keys)
  } else {
    keys.push(key)
  }
  return keys
}

function isPrefix(path, prefix) {
  if (prefix.length > path.length) return false
  for (let i = 0; i < prefix.length; i++) {
    if (!equals(path[i], prefix[i])) return false
  }
  return true
}
function applyDicToPath(path, sortedDic) {
  // Base case: if the path is empty, nothing to replace.
  if (path.length === 0) return []
  // Iterate over the dictionary entries in descending order.
  for (const { entry, index } of sortedDic) {
    if (isPrefix(path, entry)) {
      // Found a match: remove the matched prefix.
      const remainder = path.slice(entry.length)
      // Recursively apply dictionary replacement on the remainder.
      const replacedRemainder = applyDicToPath(remainder, sortedDic)
      // If the remainder is completely replaced (i.e. replacedRemainder is a single dictionary reference array),
      // then merge the current dictionary index with that.
      if (replacedRemainder.length === 0) {
        // No remainder: simply return the dictionary reference.
        return [[index]]
      }
      if (Array.isArray(replacedRemainder[0])) {
        // The first component is already a dictionary reference: merge the indices.
        return [[index, ...replacedRemainder[0]]]
      } else {
        // Otherwise, return the dictionary reference for the prefix and then the literal remainder.
        return [[index]].concat(replacedRemainder)
      }
    }
  }
  // If no dictionary entry applies, return the original literal path.
  return path
}

function applyDic(arr, dic) {
  // Build sorted dictionary entries in descending order by length.
  const sortedDic = dic
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => b.entry.length - a.entry.length)
  // For each pair, apply dictionary replacement to the path.
  return arr.map(pair => {
    const newPath = applyDicToPath(pair[0], sortedDic)
    return [newPath, pair[1]]
  })
}

function encodePaths(data) {
  for (let v of data) {
    let path = []
    for (let v2 of v[0]) {
      if (is(Number, v2)) path.push([0, 0, v2])
      else if (is(String, v2)) {
        const key = v2.split("").map(c => c.charCodeAt(0))
        path.push([key.length, ...(key.length == 0 ? [1] : key)])
      } else if (is(Array, v2)) {
        if (v2.length === 1) path.push([0, 3, v2[0]])
        else path.push([0, 4, v2.length, ...v2])
      }
    }
    v[0] = path
  }
  return data
}

function mapDic(dic, len) {
  let _map = []
  while (dic.length > 0) {
    let dlen = dic.shift()
    let _elms = []
    while (dlen > 0) {
      let type = dic.shift()
      let elms = []
      if (type == 7) {
        let slen = dic.shift()
        elms.push(slen)
        for (let i = 0; i < slen; i++) elms.push(dic.shift())
        _elms.push(elms)
      } else if (type == 3) {
        elms = concat(elms, [0, 0, dic.shift()])
        _elms.push(elms)
      } else if (type == 9) {
        for (let v2 of _map[dic.shift()]) _elms.push(v2)
      }
      dlen--
    }
    _map.push(_elms)
    if (_map.length === len) break
  }
  return _map
}

function encodeDic(dict) {
  let enc = []
  for (let v of dict) {
    let len = 1
    let elms = []
    if (!is(String, v)) {
      len = 0
      for (let v2 of v) {
        if (is(Array, v2)) {
          len += v2.length
          for (let v3 of v2) elms = concat(elms, [9, v3])
        } else {
          len += 1
          if (is(String, v2)) {
            elms.push(7)
            elms.push(v2.length)
            elms = concat(
              elms,
              v2.split("").map(c => c.charCodeAt(0)),
            )
          } else {
            elms = concat(elms, [3, v2])
          }
        }
      }
    } else {
      elms.push(7)
      elms.push(v.length)
      elms = concat(
        elms,
        v.split("").map(c => c.charCodeAt(0)),
      )
    }
    enc = concat(enc, [len, ...elms])
  }
  return enc
}

function encode(json, nodic = false) {
  let dic = null
  let dictionary, keyMap
  if (nodic !== true) {
    ;({ dictionary, keyMap } = genDic(json))
    if (dictionary.length > 0) dic = encodeDic(dictionary)
  }
  let enc = _encode(json)
  if (dic) enc = applyDic(enc, keyMap)

  enc = encodePaths(enc)
  enc.sort((a, b) => {
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
  const _dic = dic ? [1, 0, 2, dictionary.length, ...dic] : []
  return concat(
    _dic,
    enc.reduce((arr, v) => arr.concat([...flattenPath(v[0]), ...v[1]]), []),
  )
}

function _decode(arr) {
  let vals = []
  let dic = []
  while (arr.length > 0) {
    let plen = arr.shift()
    let keys = []
    let val = null
    let skip = false
    while (plen > 0) {
      const plen2 = arr.shift()
      if (plen2 == 0) {
        const plen3 = arr.shift()
        if (plen3 == 1) {
          keys.push([plen2, plen3])
        } else if (plen3 == 0) {
          keys.push([plen2, plen3, arr.shift()])
        } else if (plen3 == 2) {
          const dict = arr.shift()
          dic = mapDic(arr, dict)
          skip = true
        } else if (plen3 == 3) {
          const _keys = dic[arr.shift()]
          for (const k of _keys) keys.push(k)
        } else if (plen3 == 4) {
          let key = []
          let plen4 = arr.shift()
          for (let i2 = 0; i2 < plen4; i2++) {
            const _keys = dic[arr.shift()]
            for (const k of _keys) keys.push(k)
          }
        }
      } else if (plen2 != 0) {
        const plen3 = plen2
        let key = []
        for (let i2 = 0; i2 < plen3; i2++) key.push(arr.shift())
        keys.push([plen2, ...key])
      }
      plen--
    }
    if (skip) continue
    const type = arr.shift()
    val = [type]
    if (type == 5 || type == 6) {
      val.push(arr.shift())
      val.push(arr.shift())
    } else if (type == 3 || type == 4) {
      val.push(arr.shift())
    } else if (type == 7) {
      const strlen = arr.shift()
      val.push(strlen)
      for (let i2 = 0; i2 < strlen; i2++) val.push(arr.shift())
    }
    vals.push([keys, val])
  }
  return vals
}

// 0: null, 1: true, 2: false, 3: positive integer, 4: negative integer, 5: positive float, 6: negative float, 7: string, 8: object, 9: ref

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
    let type = 3
    if (v >= 0) {
      if (moved > 0) type = 5
    } else {
      if (moved > 0) type = 6
      else type = 4
    }
    vals.push(type)
    if (moved > 0) vals.push(moved)
    if (v < 0) vals.push(-num)
    else vals.push(num)
  } else if (typeof v == "boolean") vals.push(v ? 1 : 2)
  else if (v == null) vals = [0]
  else if (typeof v == "string") {
    vals = [7, v.length, ...v.split("").map(c => c.charCodeAt(0))]
  } else vals = [8, ...encode(v)]
  return vals
}

function decodeVal(arr) {
  const type = arr[0]
  const _val = arr[1]
  let val = null
  if (type == 0) {
    val = null
  } else if (type == 1) {
    val = true
  } else if (type == 2) {
    val = false
  } else if (type == 3) {
    val = arr[1]
  } else if (type == 4) {
    val = arr[1] * -1
  } else if (type == 5) {
    val = arr[2]
    for (let i = 0; i < arr[1]; i++) {
      val /= 10
    }
  } else if (type == 6) {
    val = arr[2] * -1
    for (let i = 0; i < arr[1]; i++) {
      val /= 10
    }
  } else if (type == 7) {
    val = arr
      .slice(2)
      .map(c => String.fromCharCode(Number(c)))
      .join("")
  } else if (type == 8) {
    val = decode(arr.slice(1))
  }
  return val
}

function decode(arr) {
  const decoded = _decode(arr)
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

const toIndex = str => {
  return (
    "1" +
    str
      .split("")
      .map(s => base64Map[s])
      .join("")
  )
}

const fromIndex = id => {
  let _id = id.toString().split("")
  _id.shift()
  return splitEvery(2, _id)
    .map(s => {
      return strMap[s.join("")]
    })
    .join("")
}

function toSignal(arr, uint_len = 75) {
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
  if (!uint_len) uint_len = _arr * 100
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
    if (len2 + v.length > uint_len) {
      arrs2.push("1" + str2)
      if (+v[0] == 0) {
        let len3 = uint_len - len2
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

function toUint8(sig) {
  let num = BigInt(sig)
  let byteArray = []
  while (num > 0) {
    byteArray.push(Number(num % 256n))
    num /= 256n
  }
  return new Uint8Array(byteArray.reverse())
}
function compress(arr) {
  let sig = toSignal(arr, false)
  return toUint8(sig)
}

function decompress(arr) {
  const str = fromUint8(arr)
  return fromSignal([str])
}

function fromUint8(arr) {
  let num = 0n
  for (let byte of arr) {
    num = num * 256n + BigInt(byte)
  }
  return num.toString()
}

module.exports = {
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
  compress,
  decompress,
  toUint8,
  fromUint8,
}
