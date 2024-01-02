function flatten(array) {
  const meta = []
  const body = []
  let arr = 0
  let sum = 0
  function _flatten(sub) {
    if (Array.isArray(sub)) {
      arr += 1
      meta.push(sub.length)
      sum += sub.length
      for (const v of sub) _flatten(v)
    } else {
      meta.push(0)
      body.push(sub)
    }
  }
  _flatten(array)
  return [meta.length, body.length, ...meta, ...body]
}

function recover(arr) {
  const len = arr[0]
  const blen = arr[1]
  const meta = arr.slice(2, len + 2)
  const body = arr.slice(len + 2)
  const b_queue = [...body]
  function _recover(m_queue) {
    if (m_queue.length === 0) return
    const size = m_queue.shift()
    if (size === 0) return b_queue.shift()
    const result = []
    for (let i = 0; i < size; i++) {
      let res = _recover(m_queue)
      if (Array.isArray(res)) {
        let i2 = 0
        for (let v of res) {
          if (Array.isArray(v)) {
            const len = v[0]
            if (typeof len === "number" && v.length >= len) {
              const meta = v.slice(2, len + 2)
              const body = v.slice(len + 2)
              if (v[0] == meta.length && v[1] == body.length) {
                res[i2] = recover(v)
              }
            }
          }
          i2++
        }
      }
      result.push(res)
    }
    return result
  }

  return _recover(meta)
}
function _encode(v) {
  let type = null
  let val = null
  if (typeof v === "number") {
    type = 2
    val = v
  } else if (typeof v === "boolean") {
    type = 1
    val = v ? 1 : 0
  } else if (v === null) {
    type = 0
  } else if (typeof v === "string") {
    type = 3
    val = v.split("").map(c => c.charCodeAt(0))
  } else if (Array.isArray(v)) {
    type = 4
    val = v.map(encode)
  } else if (typeof v === "object") {
    type = 5
    val = []
    for (const k in v) {
      const key = k.split("").map(c => c.charCodeAt(0))
      const _val = encode(v[k])
      val.push([key, _val])
    }
  }
  let arr = [type]
  if (val !== null) arr.push(val)
  return arr
}

function encode(json) {
  return flatten(_encode(json))
}
function _decode(arr) {
  const type = arr[0]
  const _val = arr[1]
  let val = null
  if (type === 0) {
    val = null
  } else if (type === 1) {
    val = arr[1] ? true : false
  } else if (type === 2) {
    val = arr[1]
  } else if (type === 3) {
    val = arr[1].map(c => String.fromCharCode(c)).join("")
  } else if (type === 4) {
    val = []
    for (let v of _val) val.push(_decode(v))
  } else if (type === 5) {
    val = {}
    for (let v of _val) {
      const key = v[0].map(c => String.fromCharCode(c)).join("")
      val[key] = _decode(v[1])
    }
  }
  return val
}

function decode(arr) {
  return _decode(recover(arr))
}
module.exports = { encode, decode }
