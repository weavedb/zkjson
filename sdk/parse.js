const { length, next, arr: _arr, push, pop, last } = require("./uint")
const _null_ = [110, 117, 108, 108]
const _true_ = [116, 114, 117, 101]
const _false_ = [102, 97, 108, 115, 101]

const eql = (a, b) => {
  if (a.length != b.length) return 0
  for (let i = 0; i < b.length; i++) {
    if (a[i] != b[i]) return 0
  }
  return 1
}

const eql2 = (a, b, blen, size = 100) => {
  var alen = length(a, size)
  if (alen != blen) return 0
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < blen; i++) {
    c = next(a, c)
    if (c[0] != b[i]) return 0
  }
  return 1
}

const constVal = (_v, type) => {
  let val = []
  val.push(type)
  if (type == 1) {
    if (eql(_v, _true_) == 1) {
      val.push(1)
    } else {
      val.push(0)
    }
  } else if (type == 3) {
    val.push(_v.length)
    for (let v of _v) {
      val.push(v)
    }
  } else if (type == 2) {
    if (_v[0] == 45) {
      val.push(0)
    } else {
      val.push(1)
    }
    let after = 0
    let right = 0
    let digits = 0
    for (let v of _v) {
      if (v == 46) {
        after = 1
      } else if (v != 45) {
        if (after == 1) right += 1
        digits = digits * 10 + (v - 48)
      }
    }
    val.push(right)
    val.push(digits)
  }
  return val
}

const constVal2 = (_v, type, size) => {
  var val = _arr(size)
  push(val, size, 9, type)
  if (type == 1) {
    if (eql2(_v, _true_, 4, size) == 1) {
      push(val, size, 9, 1)
    } else {
      push(val, size, 9, 0)
    }
  } else if (type == 3) {
    push(length(_v, size))
    var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
    while (c[5] == 0) {
      c = next(_v, c)
      push(val, size, 9, c[0])
    }
  } else if (type == 2) {
    if (_v[0] == 45) {
      push(val, size, 9, 0)
    } else {
      push(val, size, 9, 1)
    }
    let after = 0
    let right = 0
    let digits = 0
    var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
    while (c[5] == 0) {
      c = next(_v, c)
      if (c[0] == 46) {
        after = 1
      } else if (c[0] != 45) {
        if (after == 1) right += 1
        digits = digits * 10 + (c[0] - 48)
      }
    }
    push(val, size, 9, right)
    push(val, size, 9, digits)
  }
  return val
}

const constPath = p => {
  let pth = [p.length]
  for (let _v of p) {
    if (Array.isArray(_v)) {
      pth.push(_v.length)
      for (let v2 of _v) pth.push(v2)
    } else {
      pth.push(0)
      pth.push(0)
      pth.push(_v)
    }
  }
  return pth
}

const constPath2 = (p, size) => {
  let pth = [p.length]
  var pth2 = _arr(size)
  for (let _v of p) {
    if (Array.isArray(_v)) {
      pth.push(_v.length)
      for (let v2 of _v) pth.push(v2)
    } else {
      pth.push(0)
      pth.push(0)
      pth.push(_v)
    }
  }
  return pth2
}

const parse = (str, size = 100) => {
  var val = []
  var val2 = _arr(size)
  var inVal = 0
  var isNum = 0
  var esc = 0
  var nextKey = 0
  var arr = 0
  var obj = 0
  var path = []
  var path2 = _arr(size)
  var ao = _arr(5)
  var ind = _arr(5)
  var err = 0
  var json = []
  let c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  while (c[5] == 0) {
    c = next(str, c)
    var s = c[0]
    if (inVal == 1) {
      if (s == 92) {
        esc = 1
      } else if (s == 34) {
        if (esc == 1) {
          val.push(s)
          push(val2, size, 9, s)
        } else {
          inVal = 0
          if (nextKey == 1 && last(ao, 5) == 1) {
            path.push(val) // val push
          } else {
            if (last(ao, 5) == 2) {
              var _ind = last(ind, 5)
              path.push(_ind)
              ind = pop(ind, 5)
              push(ind, 5, 9, _ind + 1)
            }
            // console.log("val: ", `< ${path.join(".")} >`, val)
            //console.log(constVal2(val2, 3, size))
            json.push([constPath(path), constVal(val, 3)])
            path.pop()
          }

          val = []
          val2 = _arr(size)
          nextKey = 0
        }
        esc = 0
      } else {
        val.push(s)
        push(val2, size, 9, s)
        esc = 0
      }
    } else if (isNum == 1) {
      if (s == 44 || s == 32 || s == 125 || s == 93) {
        if (last(ao, 5) == 2) {
          var _ind = last(ind, 5)
          path.push(_ind)
          ind = pop(ind, 5)
          push(ind, 5, 9, _ind + 1)
        }
        if (
          eql2(val2, _true_, 4, size) == 0 &&
          eql2(val2, _false_, 5, size) == 0 &&
          eql2(val2, _null_, 4, size) == 0 &&
          Number.isNaN(+val)
        ) {
          err = 1
        }
        // console.log("val: ", `< ${path.join(".")} >`, val)
        var type = 2
        if (eql2(val2, _null_, 4, size) == 1) {
          type = 0
        } else if (
          eql2(val2, _true_, 4, size) == 1 ||
          eql2(val2, _false_, 5, size)
        ) {
          type = 1
        }
        //console.log(constVal2(val2, type, size))
        json.push([constPath(path), constVal(val, type)])
        path.pop()
        if (s == 93) {
          if (last(ao, 5) != 2) err = 1
          ao.pop()
          path.pop()
          arr--
          pop(ind, 5)
        }
        if (s == 125) {
          if (last(ao, 5) != 1) err = 1
          pop(ao, 5)
          path.pop()
          obj--
        }
        isNum = 0
        val = []
        val2 = _arr(size)
        if (s == 44) nextKey = 1
      } else {
        val.push(s)
        push(val2, size, 9, s)
      }
    } else if (s == 34) {
      inVal = 1
    } else if (
      s != 123 &&
      s != 58 &&
      s != 32 &&
      s != 44 &&
      s != 91 &&
      s != 93 &&
      s != 125
    ) {
      isNum = 1
      val.push(s)
      push(val2, size, 9, s)
    } else {
      if (s != 32) {
        if (s == 123 || s == 44) nextKey = 1
        if (s == 123) {
          if (last(ao, 5) == 2) {
            var _ind = last(ind, 5)
            path.push(_ind)
            ind = pop(ind, 5)
            push(ind, 5, 9, _ind + 1)
          }
          push(ao, 5, 9, 1)
          obj++
        }
        if (s == 125) {
          if (last(ao, 5) != 1) err = 1
          pop(ao, 5)
          path.pop()
          obj--
        }
        if (s == 91) {
          if (last(ao, 5) == 2) {
            var _ind = last(ind, 5)
            path.push(_ind)
            ind = pop(ind, 5)
            push(ind, 5, 9, _ind + 1)
          }
          push(ind, 5, 9, 0)
          push(ao, 5, 9, 2)
          arr++
        }
        if (s == 93) {
          if (last(ao, 5) != 2) err = 1
          pop(ao, 5)
          pop(ind, 5)
          path.pop()
          arr--
        }
      }
    }
  }

  if (length(val2, size)) {
    isNum = 0
    // maybe need type this is only for bare values
    //console.log(constVal2(val2, type, size))
    json.push([constPath(path), constVal(val)])
    //for (var v of path) json[json.length - 1][0].push(v)
  }
  if (ao.length > 0) err = 1
  if (ind.length > 0) err = 1
  if (inVal) err = 1
  if (isNum) err = 1
  var j = _arr(size)
  for (var v of json) {
    for (var v2 of v) {
      for (var v3 of v2) {
        j = push(j, size, 9, v3)
      }
    }
  }
  return j
}

module.exports = { parse }
