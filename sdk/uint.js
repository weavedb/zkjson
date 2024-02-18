function digits(x) {
  if (x == 0) return 1n
  var p = 0n
  while (x > 0) {
    x = (x / 10n) >> 0n
    p++
  }
  return p
}

function arr(row) {
  var _arr = []
  for (var i = 0; i < row; i++) {
    _arr.push(0n)
  }
  return _arr
}

function toArray(json, size) {
  json = bn(json)
  var j = []
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  while (c[5] == 0) {
    c = next(json, c)
    j.push(c[0])
  }
  return j.map(n => Number(n))
}

function arrPush(json, size, digit, index, val) {
  json = bn(json)
  index = bn(index)
  var len = get(json, size, 0)
  var _sum = sum(json, size, digit, 1, index + 2n)
  var at = _sum + 1n + len
  json = insert(json, size, digit, at, val)
  var alen = get(json, size, index + 1n)
  json = replace(json, size, digit, index + 1n, alen + 1n)
  return json
}

function arrGet(json, size, digit, index, index2) {
  json = bn(json)
  index = bn(index)
  index2 = bn(index2)
  var len = get(json, size, 0)
  var _sum = sum(json, size, digit, 1, index + 1n)
  var at = _sum + 1n + len + index2
  return get(json, size, at)
}

function pushArray(json, size, digit, _arr, asize) {
  json = bn(json)
  var jlen = length(json, size)
  var alen = 0n
  if (jlen == 0) {
    json = push(json, size, digit, 1)
  } else {
    alen = get(json, size, 0)
    json = replace(json, size, digit, 0, alen + 1n)
  }
  var len = length(_arr, size)
  json = insert(json, size, digit, alen + 1n, len)
  var c = bn([0, asize, 0, 0, 0, 0, 0, 0, 0])
  while (c[5] == 0) {
    c = next(_arr, c)
    json = push(json, size, digit, c[0])
  }
  return json
}

function popArray(json, size, digit) {
  json = bn(json)
  var jlen = length(json, size)
  var alen = 0n
  if (jlen == 0) {
    throw Error()
  } else {
    alen = get(json, size, 0)
  }
  if (alen == 1) return arr(size)
  var len = get(json, size, alen)
  json = replace(json, size, digit, 0, alen - 1n)
  var _sum = sum(json, size, digit, 1, alen)
  var start = alen + 1n + _sum
  var end = start + len + 1n
  json = remove(json, size, digit, start, end)
  json = remove(json, size, digit, alen, alen + 1n)
  return json
}

function length(json, size) {
  json = bn(json)
  var _len = 0n
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  while (c[5] == 0) {
    c = next(json, c)
    _len++
  }
  if (json[0] != 0) {
    return _len
  } else {
    return 0
  }
}

function sum(json, size, digit, start, end) {
  json = bn(json)
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var _sum = 0n
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i >= start && i < end) _sum += c[0]
    i++
  }
  return _sum
}

function mul(json, size, digit, start, end) {
  json = bn(json)
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var _mul = 0
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i >= start && i < end) _mul *= c[0]
    i++
  }
  return _mul
}

function remove(json, size, digit, start, end) {
  json = bn(json)
  var _arr = arr(size)
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i < start || i >= end) {
      _arr = push(_arr, size, digit, c[0])
    }
    i++
  }
  return _arr
}

function slice(json, size, digit, start, end) {
  json = bn(json)
  var _arr = arr(size)
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i >= start && i < end) _arr = push(_arr, size, digit, c[0])
    i++
  }
  return _arr
}

function get(json, size, index) {
  json = bn(json)
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i == index) return c[0]
    i++
  }
  throw Error()
}

function insert(json, size, digit, at, val) {
  json = bn(json)
  var _arr = arr(size)
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var i = 0
  if (at == 0) {
    _arr = push(_arr, size, digit, val)
  }
  while (c[5] == 0) {
    c = next(json, c)
    _arr = push(_arr, size, digit, c[0])
    i++
    if (at == i) _arr = push(_arr, size, digit, val)
  }
  return _arr
}

function replace(json, size, digit, at, val) {
  json = bn(json)
  var _arr = arr(size)
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (at == i) {
      _arr = push(_arr, size, digit, val)
    } else {
      _arr = push(_arr, size, digit, c[0])
    }
    i++
  }
  return _arr
}

function last(json, size) {
  json = bn(json)
  var val = 0
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  while (c[5] == 0) {
    c = next(json, c)
    val = c[0]
  }
  return val
}

function lastRow(json, size) {
  json = bn(json)
  var v = 0
  for (var j = 0; j < size; j++) {
    if (json[j] != 0) v = j
  }
  return v
}

function shift(json, size, digit) {
  json = bn(json)
  var _arr = arr(size)
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i > 0) _arr = push(_arr, size, digit, c[0])
    i++
  }
  return _arr
}

function unshift(json, size, digit, num) {
  json = bn(json)
  var _arr = arr(size)
  _arr = push(_arr, size, digit, num)

  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var i = 0
  if (json[0] != 0) {
    while (c[5] == 0) {
      c = next(json, c)
      _arr = push(_arr, size, digit, c[0])
      i++
    }
  }
  return _arr
}

function concat(json, json2, size, digit) {
  json = bn(json)
  var c = bn([0, size, 0, 0, 0, 0, 0, 0, 0])
  var i = 0
  if (json2[0] != 0) {
    while (c[5] == 0) {
      c = next(json2, c)
      json = push(json, size, digit, c[0])
      i++
    }
  }
  return json
}

function pop(json, size, overflow = 8) {
  json = bn(json)
  overflow = bn(overflow)
  var l = 0n
  var ll = 0n
  var lnum = 0n
  var series = 0n
  var snum = 0n
  var link = 0n
  var _l = 0n
  var _d = 0n
  for (var l2 = 0n; l2 < size; l2++) {
    if (json[l2] != 0) {
      _l = l2
      var x = json[l2]
      var d = digits(x)
      var p = d
      var on = 0n
      var i = 0n
      while (x > 0) {
        var n = (x / 10n ** (p - 1n)) >> 0n
        x -= 10n ** (p - 1n) * n
        p--
        i++
        if (on == 0) {
          on = 1n
        } else {
          var len = n
          if (link == 0) {
            ll = i - 1n
            l = l2
            _d = d
          }
          lnum = len
          snum = 0n
          if (len == 0) {
            var n = (x / 10n ** (p - 1n)) >> 0n
            var len2 = (x / 10n ** (p - 1n)) >> 0n
            series = len2
            x -= 10n ** (p - 1n) * n
            p--
            i++
            for (var i2 = 0n; i2 < len2; i2++) {
              var n = (x / 10n ** (p - 1n)) >> 0n
              snum = snum * 10n + n
              x -= 10n ** (p - 1n) * n
              p--
              i++
            }
          } else {
            var _len = len
            if (len == overflow + 1n) {
              link = 2n
              _len = overflow
            } else if (link > 0) {
              link--
            }
            series = 0n
            for (var i2 = 0n; i2 < _len; i2++) {
              var n = (x / 10n ** (p - 1n)) >> 0n
              x -= 10n ** (p - 1n) * n
              p--
              i++
            }
          }
        }
      }
    }
  }

  if (link == 1) {
    for (var i = l + 1n; i <= _l; i++) {
      json[i] = 0n
    }
    if (ll < 2) {
      json[l] = 0n
    } else {
      json[l] = (json[l] / 10n ** (_d - ll)) >> 0n
    }
  } else if (series != 0) {
    if (series == 3) {
      json[l] = (json[l] / 10n ** (_d - ll)) >> 0n
      json[l] = json[l] * 10n + 1n
      var n = (snum / 10n ** 2n) >> 0n
      json[l] = json[l] * 10n + n
      json[l] = json[l] * 10n + 1n
      var n2 = ((snum / 10n) >> 0n) - n * 10n
      json[l] = json[l] * 10n + n2
    } else {
      json[l] = (json[l] / 10n ** (_d - ll - 1n)) >> 0n
      json[l] = json[l] * 10n + (series - 1n)
      snum = (snum / 10n) >> 0n
      json[l] = json[l] * 10n ** (series - 1n) + snum
    }
  } else if (ll < 2) {
    json[l] = 0n
  } else {
    json[l] = (json[l] / 10n ** (d - ll)) >> 0n
  }
  return json
}
function push(json, size, digit, c, overflow = 8) {
  overflow = bn(overflow)
  json = bn(json)
  c = bn(c)
  var i4 = 0n
  for (var i = i4; i < size; i++) {
    if (json[i] != 0) i4 = i
  }
  var init = 0n
  while (c > 0 || init == 0) {
    init = 1
    var len = digits(c)
    var _len = len
    var _len2 = len
    var _c = c
    if (overflow < len) {
      _len = overflow
      _len2 = overflow + 1n
      _c = (c / 10n ** (len - overflow)) >> 0n
      c -= _c * 10n ** (len - overflow)
    } else {
      c = 0n
    }
    var appended = 0
    for (var i = i4; i < size; i++) {
      var d = digits(json[i])
      var one = 0n
      var ones = 0n
      var nums = 0n
      if (_len == 1 && digit > d) {
        var x = json[i] - 10n ** (d - 1n)
        var i2 = 1n
        while (i2 < d) {
          var len = 0n
          len = (x / 10n ** (d - i2 - 1n)) >> 0n
          x = x - len * 10n ** (d - i2 - 1n)
          if (len == 1) {
            if (ones == 0) one = i2
            ones++
          } else if (len != 0) {
            ones = 0n
            nums = 0n
          } else {
            one = i2
          }
          i2++
          if (len == 0) {
            var len3 = (x / 10n ** (d - i2 - 1n)) >> 0n
            x = x - len3 * 10n ** (d - i2 - 1n)
            i2++
            ones = len3
            for (var i3 = 0n; i3 < len3; i3++) {
              var len2 = (x / 10n ** (d - i2 - 1n)) >> 0n
              x = x - len2 * 10n ** (d - i2 - 1n)
              nums = nums * 10n + len2
              i2++
            }
          } else {
            for (var i3 = 0n; i3 < len; i3++) {
              var len2 = (x / 10n ** (d - i2 - 1n)) >> 0n
              x = x - len2 * 10n ** (d - i2 - 1n)
              if (len == 1) nums = nums * 10n + len2
              i2++
            }
          }
        }
        if (ones == 2) nums = nums * 10n + _c
      }
      if (ones > 2 && ones < 9) {
        var x = (json[i] / 10n ** (d - one - 1n)) >> 0n
        x = x * 10n + ones + 1n
        x = x * 10n ** ones + nums
        x = x * 10n + _c
        json[i] = x
        i4 = i
        appended = 1
      } else if (ones == 2) {
        var x = (json[i] / 10n ** (d - one)) >> 0n
        x = x * 10n + 0n
        x = x * 10n + ones + 1n
        x = x * 10n ** (ones + 1n) + nums
        json[i] = x
        i4 = i
        appended = 1
      } else if (digit > d + _len && appended == 0) {
        if (json[i] == 0) json[i] = 1n
        json[i] = json[i] * 10n + _len2
        json[i] = json[i] * 10n ** _len + _c
        i4 = i
        appended = 1
      }
    }
  }
  return json
}
function str(arr) {
  return arr.map(n => n.toString())
}
function bn(arr) {
  if (typeof arr == "number") return BigInt(arr)
  if (!Array.isArray(arr)) return arr
  return arr.map(n => {
    return typeof n != "number" ? n : BigInt(n)
  })
}

function next(json, c) {
  json = bn(json)
  c = bn(c)
  if (c[5] == 1) {
    return bn([0, c[1], 0, 0, 0, 1, c[6], c[7], c[8]])
  }
  var prev = 0n
  for (var j = c[2]; j < c[1]; j++) {
    var d = digits(json[j])
    if (json[j] > 0) {
      var p = c[4] == 0 ? digits(json[j]) : c[4]
      var x = c[4] == 0 ? json[j] : c[3]
      var cur = 0n
      var num = 0n
      var on = c[4] == 0 ? 0n : c[7]
      var len = c[4] == 0 ? 0n : c[8]
      while (p > 0) {
        var n = (x / 10n ** (p - 1n)) >> 0n
        if (on == 0) {
          on = 1n
        } else if (on == 1) {
          if (n == 0) {
            on = 4n
          } else {
            if (n == 9) {
              len = 8n
              on = 3n
            } else {
              on = 2n
              len = n
            }
            cur = 0n
          }
        } else if (on == 4) {
          on = 5n
          len = n
        } else {
          num += n * 10n ** (len - cur - 1n)
          cur++
          if (on == 5) {
            num = n
            len--
            x -= 10n ** (p - 1n) * n
            p--
            var done = 0n
            if (p == 0) {
              j++
              if (c[1] == j || json[j] == 0) {
                x = 0n
                done = 1n
              } else {
                x = json[j]
              }
            }
            if (len == 0) on = 1n
            return bn([num, c[1], j, x, p, done, c[6], on, len])
          } else if (cur == len) {
            prev *= 10n ** len
            if (on == 3) {
              prev += num
            } else {
              num += prev
              x -= 10n ** (p - 1n) * n
              p--
              var done = 0n
              if (p == 0) {
                j++
                if (c[1] == j || json[j] == 0) {
                  x = 0n
                  done = 1n
                } else {
                  x = json[j]
                }
              }
              return bn([num, c[1], j, x, p, done, c[6], 1, len])
            }
            cur = 0n
            on = 1n
            len = 0n
            num = 0n
          }
        }
        x -= 10n ** (p - 1n) * n
        p--
      }
    } else {
      return bn([0, c[1], 0, 0, 0, 1, c[6], 0, 0])
    }
  }
  return bn([0, c[1], 0, 0, 0, 1, c[6], 0, 0])
}

module.exports = {
  next,
  arr,
  push,
  length,
  last,
  pop,
  toArray,
  shift,
  unshift,
  slice,
  insert,
  replace,
  get,
  pushArray,
  arrPush,
  sum,
  mul,
  arrGet,
  remove,
  popArray,
  concat,
  bn,
  digits,
}
