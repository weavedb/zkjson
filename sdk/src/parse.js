import {
  toArray,
  concat,
  sum,
  get,
  popArray,
  pushArray,
  length,
  next,
  arr as _arr,
  push,
  pop,
  last,
  bn,
} from "./uint.js"
const _null_ = [110, 117, 108, 108]
const _true_ = [116, 114, 117, 101]
const _false_ = [102, 97, 108, 115, 101]

function eql(a, b, blen, size) {
  var alen = length(a, size)
  if (alen != blen) return 0
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  for (var i = 0; i < blen; i++) {
    c = next(a, c)
    if (c[0] != b[i]) return 0
  }
  return 1
}

const constVal = (_v, type, size, digit = 9) => {
  var val = _arr(size)
  val = push(val, size, digit, type)
  if (type == 1) {
    if (eql(_v, _true_, 4, size) == 1) {
      val = push(val, size, digit, 1)
    } else {
      val = push(val, size, digit, 0)
    }
  } else if (type == 3) {
    val = push(val, size, digit, length(_v, size))
    var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
    while (c[5] == 0) {
      c = next(_v, c)
      val = push(val, size, digit, c[0])
    }
  } else if (type == 2) {
    if (get(_v, size, 0) == 45) {
      val = push(val, size, digit, 0)
    } else {
      val = push(val, size, digit, 1)
    }
    var after = 0n
    var right = 0n
    var digits = 0n
    var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
    while (c[5] == 0) {
      c = next(_v, c)
      if (c[0] == 46) {
        after = 1
      } else if (c[0] != 45) {
        if (after == 1) right += 1n
        digits = digits * 10n + (c[0] - 48n)
      }
    }
    val = push(val, size, digit, right)
    val = push(val, size, digit, digits)
  }
  return val
}

const constPath = (p, size, digit = 9) => {
  var pth2 = _arr(size)
  var len = get(p, size, 0)
  pth2 = push(pth2, size, digit, len)
  for (var i = 0n; i < len; i++) {
    var len2 = get(p, size, i + 1n)
    var _sum = sum(p, size, digit, 1, 1n + i)
    var first = get(p, size, 1n + len + _sum)
    if (first == 0) {
      pth2 = push(pth2, size, digit, 0)
    } else {
      pth2 = push(pth2, size, digit, len2)
    }
    for (var i2 = 0n; i2 < len2; i2++) {
      var v = get(p, size, 1n + len + _sum + i2)
      pth2 = push(pth2, size, digit, v)
    }
  }
  return pth2
}

const isNumber = (val, size, digit) => {
  var len = length(val, size)
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  while (c[5] == 0) {
    c = next(val, c)
    if (c[0] == 47 || c[0] < 45 || c[0] > 57) return 0
  }

  return 1
}

const parse = (str, size = 100, digit = 9) => {
  str = bn(str)
  var val = _arr(size)
  var inVal = 0
  var isNum = 0
  var esc = 0
  var nextKey = 0
  var arr = 0
  var obj = 0
  var path = _arr(size)
  var ao = _arr(5)
  var ind = _arr(5)
  var err = 0
  var json = _arr(size)
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var bare = 1
  while (c[5] == 0) {
    c = next(str, c)
    var s = c[0]
    if (inVal == 1) {
      if (s == 92) {
        esc = 1
      } else if (s == 34) {
        if (esc == 1) {
          val = push(val, size, digit, s)
        } else {
          inVal = 0
          if (nextKey == 1 && last(ao, 5) == 1) {
            path = pushArray(path, size, digit, val, size)
          } else {
            if (last(ao, 5) == 2) {
              var _ind = last(ind, 5)
              var __ind = _arr(size)
              __ind = push(__ind, size, digit, 0)
              __ind = push(__ind, size, digit, _ind)
              path = pushArray(path, size, digit, __ind, size)
              ind = pop(ind, 5)
              ind = push(ind, 5, digit, _ind + 1n)
            }
            json = concat(
              json,
              concat(
                constPath(path, size, digit),
                constVal(val, 3, size, digit),
                size,
                digit,
              ),
              size,
              digit,
            )
            if (bare == 0) path = popArray(path, size, digit)
          }
          val = _arr(size)
          nextKey = 0
        }
        esc = 0
      } else {
        val = push(val, size, digit, s)
        esc = 0
      }
    } else if (isNum == 1) {
      if (s == 44 || s == 32 || s == 125 || s == 93) {
        if (last(ao, 5) == 2) {
          var _ind = last(ind, 5)
          var __ind = _arr(size)
          __ind = push(__ind, size, digit, 0)
          __ind = push(__ind, size, digit, _ind)
          path = pushArray(path, size, digit, __ind, size)
          ind = pop(ind, 5)
          ind = push(ind, 5, digit, _ind + 1n)
        }
        if (
          eql(val, _true_, 4, size) == 0 &&
          eql(val, _false_, 5, size) == 0 &&
          eql(val, _null_, 4, size) == 0 &&
          isNumber(val, size, digit) == 0
        ) {
          err = 1
        }
        var type = 2
        if (eql(val, _null_, 4, size) == 1) {
          type = 0
        } else if (
          eql(val, _true_, 4, size) == 1 ||
          eql(val, _false_, 5, size) == 1
        ) {
          type = 1
        }
        json = concat(
          json,
          concat(
            constPath(path, size, digit),
            constVal(val, type, size, digit),
            size,
            digit,
          ),
          size,
          digit,
        )
        path = popArray(path, size, digit)
        if (s == 93) {
          if (last(ao, 5) != 2) err = 1
          ao = pop(ao, 5)
          if (bare == 0) path = popArray(path, size, digit)
          arr--
          ind = pop(ind, 5)
        }
        if (s == 125) {
          if (last(ao, 5) != 1) err = 1
          ao = pop(ao, 5)
          obj--
        }
        isNum = 0
        val = _arr(size)
        if (s == 44) nextKey = 1
      } else {
        val = push(val, size, digit, s)
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
      val = push(val, size, digit, s)
    } else {
      if (s != 32) {
        if (s == 123 || s == 44) {
          bare = 0
          nextKey = 1
        }
        if (s == 123) {
          if (last(ao, 5) == 2) {
            var _ind = last(ind, 5)
            var __ind = _arr(size)
            __ind = push(__ind, size, digit, 0)
            __ind = push(__ind, size, digit, _ind)
            path = pushArray(path, size, digit, __ind, size)
            ind = pop(ind, 5)
            ind = push(ind, 5, digit, _ind + 1n)
          }
          ao = push(ao, 5, digit, 1)
          obj++
        }
        if (s == 125) {
          if (last(ao, 5) != 1) err = 1
          ao = pop(ao, 5)
          obj--
        }
        if (s == 91) {
          if (last(ao, 5) == 2) {
            var _ind = last(ind, 5)
            var __ind = _arr(size)
            __ind = push(__ind, size, digit, 0)
            __ind = push(__ind, size, digit, _ind)
            path = pushArray(path, size, digit, __ind, size)
            ind = pop(ind, 5)
            ind = push(ind, 5, digit, _ind + 1n)
          }
          ind = push(ind, 5, digit, 0)
          ao = push(ao, 5, digit, 2)
          arr++
        }
        if (s == 93) {
          if (last(ao, 5) != 2) err = 1
          ao = pop(ao, 5)
          ind = pop(ind, 5)
          path = popArray(path, size, digit)
          arr--
        }
      }
    }
  }
  if (length(val, size) != 0) {
    var type = 4
    if (eql(val, _null_, 4, size) == 1) {
      type = 0
      isNum = 0
    } else if (eql(val, _true_, 4, size) == 1 || eql(val, _false_, 5, size)) {
      type = 1
      isNum = 0
    } else if (isNumber(val, size, digit) == 1) {
      type = 2
      isNum = 0
    }
    json = concat(
      json,
      concat(
        constPath(path, size, digit),
        constVal(val, type, size, digit),
        size,
        digit,
      ),
      size,
      digit,
    )
  }
  if (ao.length > 0) err = 1
  if (ind.length > 0) err = 1
  if (inVal) err = 1
  if (isNum) err = 1
  return json
}

export { parse }
