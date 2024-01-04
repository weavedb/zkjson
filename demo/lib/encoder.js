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
    if (num === 2 && !(s === "." || s === "[")) throw Error()
    if (s === ".") {
      if (num === 2) {
        num = 0
      } else {
        parts.push(str)
        str = ""
      }
    } else if (s === "[") {
      if (num !== 2) {
        if (str !== "" || parts.length > 0) parts.push(str)
        str = ""
      }
      num = 1
    } else if (s === "]") {
      if (num !== 1) throw Error()
      num = 2
      if (str === "" || Number.isNaN(+str)) throw Error()
      parts.push(+str)
      str = ""
    } else {
      str += s
    }
  }
  if (str !== "") parts.push(str)
  if (parts.length === 0) parts.push("")
  let encoded = [parts.length]
  for (const p of parts) {
    if (typeof p === "number") {
      encoded = encoded.concat([0, 0, p])
    } else {
      let plen = [p.length]
      if (p.length === 0) plen.push(1)
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
    if (type === 0) {
      const type2 = path.shift()
      if (type2 === 0) {
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
    if (s[0] === 0 && s[1] === 0) {
      str += `[${s[2]}]`
    } else if (s[0] === 0 && s[1] === 1) {
      if (str !== "") str += "."
    } else {
      str += `${i === 0 ? "" : "."}${s
        .slice(1)
        .map(c => String.fromCharCode(c))
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
  if (typeof v === "number") {
    vals.push([path, encodeVal(v)])
  } else if (typeof v === "boolean") {
    vals.push([path, encodeVal(v)])
  } else if (v === null) {
    vals.push([path, encodeVal(v)])
  } else if (typeof v === "string") {
    vals.push([path, encodeVal(v)])
  } else if (Array.isArray(v)) {
    let i = 0
    for (const v2 of v) {
      for (const v3 of _encode(v2, [...path, [0, 0, i]])) vals.push(v3)
      i++
    }
  } else if (typeof v === "object") {
    for (const k in v) {
      const key = k.split("").map(c => c.charCodeAt(0))
      for (let v4 of _encode(v[k], [
        ...path,
        [key.length, ...(key.length === 0 ? [1] : key)],
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
    const isUndefined = v => typeof v === "undefined"
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
    []
  )
}

function _decode(arr, obj) {
  let vals = []
  while (arr.length > 0) {
    let plen = arr.shift()
    let keys = []
    let val = null
    while (plen > 0) {
      const plen2 = arr.shift()
      if (plen2 === 0) {
        const plen3 = arr.shift()
        if (plen3 === 1) {
          keys.push([plen2, plen3])
        } else {
          keys.push([plen2, plen3, arr.shift()])
        }
      } else if (plen2 !== 0) {
        const plen3 = plen2
        const key = []
        for (let i2 = 0; i2 < plen3; i2++) key.push(arr.shift())
        keys.push([plen2, ...key])
      }
      plen--
    }
    const type = arr.shift()
    val = [type]
    if (type === 2) {
      val.push(arr.shift())
      val.push(arr.shift())
    } else if (type === 1) {
      val.push(arr.shift())
    } else if (type === 3) {
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
  if (typeof v === "number") {
    vals = v < 0 ? [2, 0, -v] : [2, 1, v]
  } else if (typeof v === "boolean") {
    vals = [1, v ? 1 : 0]
  } else if (v === null) {
    vals = [0]
  } else if (typeof v === "string") {
    vals = [3, v.length, ...v.split("").map(c => c.charCodeAt(0))]
  }
  return vals
}

function decodeVal(arr) {
  const type = arr[0]
  const _val = arr[1]
  let val = null
  if (type === 0) {
    val = null
  } else if (type === 1) {
    val = arr[1] ? true : false
  } else if (type === 2) {
    val = (arr[1] === 0 ? -1 : 1) * arr[2]
  } else if (type === 3) {
    val = arr
      .slice(2)
      .map(c => String.fromCharCode(c))
      .join("")
  }
  return val
}

function decode(arr) {
  const decoded = _decode(arr)
  let json =
    decoded[0]?.[0]?.[0]?.[0] === 0 && decoded[0]?.[0]?.[0]?.[1] === 0 ? [] : {}
  for (const v of decoded) {
    const keys = v[0].map(v2 => {
      if (v2[0] === 0) {
        if (v2[1] === 1) return ""
        return v2[2]
      } else {
        return v2
          .slice(1)
          .map(c => String.fromCharCode(c))
          .join("")
      }
    })
    if (keys.length === 0) {
      json = decodeVal(v[1])
    } else {
      let obj = json
      let i = 0
      for (const k of keys) {
        if (typeof k === "number") {
          if (typeof keys[i + 1] === "undefined") {
            obj[k] = decodeVal(v[1])
          } else {
            if (typeof obj[k] === "undefined") {
              if (typeof keys[i + 1] === "string") {
                obj[k] = {}
              } else {
                obj[k] = []
              }
            }
          }
        } else {
          if (typeof obj[k] === "undefined") {
            if (typeof keys[i + 1] === "undefined") {
              obj[k] = decodeVal(v[1])
            } else if (typeof keys[i + 1] === "string") {
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
}
