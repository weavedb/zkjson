function digits(x) {
  if (x == 0) return 1
  var p = 0
  while (x > 0) {
    x = (x / 10) >> 0 // x = x \ 10
    p++
  }
  return p
}

const arr = row => {
  var _arr = []
  for (var i = 0; i < row; i++) {
    _arr.push(0)
  }
  return _arr
}

const toArray = (json, size) => {
  var j = []
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  while (c[5] == 0) {
    c = next(json, c)
    j.push(c[0])
  }
  return j
}


const arrPush = (json, size, digit, index, val) => {
  var len = get(json, size, 0)
  var _sum = sum(json, size, digit, 1, index + 2)
  var at = _sum + 1 + len
  json = insert(json, size, digit, at, val)
  var alen = get(json, size, index + 1)
  json = replace(json, size, digit, index + 1, alen + 1)
  return json
}

const arrGet = (json, size, digit, index, index2) => {
  var len = get(json, size, 0)
  var _sum = sum(json, size, digit, 1, index + 1)
  var at = _sum + 1 + len + index2
  return get(json, size, at)
}

const pushArray = (json, size, digit, _arr, asize) => {
  var jlen = length(json,size)
  var alen = 0
  if(jlen == 0) {
    json = push(json, size, digit, 1)
  }else{
    alen = get(json, size, 0)
    json = replace(json, size, digit, 0, alen + 1)
  }
  var len = length(_arr,size)
  json = insert(json, size, digit, alen + 1, len)
  var c = [0, asize, 0, 0, 0, 0, 0, 0, 0]
  while (c[5] == 0) {
    c = next(_arr, c)
    json = push(json, size, digit, c[0])
  }
  return json
}

const popArray = (json, size, digit) => {
  var jlen = length(json,size)
  var alen = 0
  if(jlen == 0) {
    throw Error()
  }else{
    alen = get(json, size, 0)
  }
  if(alen == 1) return []
  var len = get(json, size, alen)
  json = replace(json, size, digit, 0, alen - 1)
  var _sum = sum(json, size, digit, 1, alen)
  var start = alen + 1 +_sum
  var end = start + len + 1
  json = remove(json, size, digit, start,  end)
  json = remove(json, size, digit, alen,  alen + 1)
  return json
}


const length = (json, size) => {
  var _len = 0
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  var nonzero = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (c[0] > 0) nonzero = 1
    _len++
  }
  if (nonzero) {
    return _len
  } else {
    return 0
  }
}

const sum = (json, size, digit, start, end) =>{
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  var _sum = 0
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i >= start && i < end) _sum += c[0]
    i++
  }
  return _sum
}

const mul = (json, size, digit, start, end) =>{
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  var _mul = 0
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i >= start && i < end) _mul *= c[0]
    i++
  }
  return _mul
}

const remove = (json, size, digit, start, end) =>{
  var _arr = arr(size)
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i < start || i >= end) push(_arr, size, digit, c[0])
    i++
  }
  return _arr
}

const slice = (json, size, digit, start, end) =>{
  var _arr = arr(size)
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i >= start && i < end) push(_arr, size, digit, c[0])
    i++
  }
  return _arr
}

const get = (json,size,index) =>{
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if(i == index) return c[0]
    i++
  }
  throw Error()
}

const insert = (json, size, digit, at, val) =>{
  var _arr = arr(size)
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  var i = 0
  if(at == 0) {
    _arr = push(_arr, size, digit, val)
  }
  while (c[5] == 0) {
    c = next(json, c)
    push(_arr, size, digit, c[0])
    i++
    if(at == i) push(_arr, size, digit, val)
  }
  return _arr
}

const replace = (json, size, digit, at, val) =>{
  var _arr = arr(size)
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if(at == i) {
      _arr = push(_arr, size, digit, val)
    }else{
      push(_arr, size, digit, c[0])
    }
    i++
  }
  return _arr
}

const last = (json, size) => {
  var val = 0
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  while (c[5] == 0) {
    c = next(json, c)
    val = c[0]
  }
  return val
}
const lastRow = (json, size) => {
  var v = 0
  for (var j = 0; j < size; j++) {
    if (json[j] != 0) v = j
  }
  return v
}

const shift = (json, size, digit) => {
  var _arr = arr(size)
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  var i = 0
  while (c[5] == 0) {
    c = next(json, c)
    if (i > 0) push(_arr, size, digit, c[0])
    i++
  }
  return _arr
}

const unshift = (json, size, digit, num) => {
  var _arr = arr(size)
  push(_arr, size, digit, num)
  var c = [0, size, 0, 0, 0, 0, 0, 0, 0]
  var i = 0
  if (json[0] !== 0) {
    while (c[5] == 0) {
      c = next(json, c)
      push(_arr, size, digit, c[0])
      i++
    }
  }
  return _arr
}

const pop = (json, size, overflow = 3) => {
  var l = 0
  var ll = 0
  var lnum = 0
  var series = 0
  var snum = 0
  var link = 0
  var _l = 0
  var _d = 0
  for (var l2 = 0; l2 < size; l2++) {
    if (json[l2] != 0) {
      _l = l2
      var x = json[l2]
      var d = digits(x)
      var p = d
      var on = 0
      var i = 0
      while (x > 0) {
        var n = (x / 10 ** (p - 1)) >> 0 // var n = x \ 10 ** (p - 1)
        x -= 10 ** (p - 1) * n
        p--
        i++
        if (on == 0) {
          on = 1
        } else {
          var len = n
          if (link == 0) {
            ll = i - 1
            l = l2
            _d = d
          }
          lnum = len
          snum = 0
          if (len == 0) {
            var n = (x / 10 ** (p - 1)) >> 0 // var n = x \ 10 ** (p - 1)
            var len2 = (x / 10 ** (p - 1)) >> 0 // var n = x \ 10 ** (p - 1)
            series = len2
            x -= 10 ** (p - 1) * n
            p--
            i++
            for (var i2 = 0; i2 < len2; i2++) {
              var n = (x / 10 ** (p - 1)) >> 0 // var n = x \ 10 ** (p - 1)
              snum = snum * 10 + n
              x -= 10 ** (p - 1) * n
              p--
              i++
            }
          } else {
            var _len = len
            if (len == overflow + 1) {
              link = 2
              _len = overflow
            } else if (link > 0) {
              link--
            }
            series = 0
            for (var i2 = 0; i2 < _len; i2++) {
              var n = (x / 10 ** (p - 1)) >> 0 // var n = x \ 10 ** (p - 1)
              x -= 10 ** (p - 1) * n
              p--
              i++
            }
          }
        }
      }
    }
  }

  if (link == 1) {
    for (var i = l + 1; i <= _l; i++) {
      json[i] = 0
    }
    if (ll < 2) {
      json[l] = 0
    } else {
      json[l] = (json[l] / 10 ** (_d - ll)) >> 0
    }
  } else if (series != 0) {
    if (series == 3) {
      json[l] = (json[l] / 10 ** (d - ll)) >> 0
      json[l] = json[l] * 10 + 1
      var n = (snum / 10 ** 2) >> 0
      json[l] = json[l] * 10 + n
      json[l] = json[l] * 10 + 1
      var n2 = ((snum / 10) >> 0) - n * 10
      json[l] = json[l] * 10 + n2
    } else {
      json[l] = (json[l] / 10 ** (d - ll - 1)) >> 0
      json[l] = json[l] * 10 + (series - 1)
      snum = (snum / 10) >> 0
      json[l] = json[l] * 10 ** (series - 1) + snum
    }
  } else if (ll < 2) {
    json[l] = 0
  } else {
    json[l] = (json[l] / 10 ** (d - ll)) >> 0
  }
  return json
}

const push = (json, size, digit, c, overflow = 3) => {
  var i4 = 0
  var init = 0
  while (c > 0 || init == 0) {
    init = 1
    var len = digits(c)
    var _len = len
    var _len2 = len
    var _c = c
    if (overflow < len) {
      _len = overflow
      _len2 = overflow + 1
      _c = (c / 10 ** (len - overflow)) >> 0 // _c = c \ 10 ** (len - overflow)
      c -= _c * 10 ** (len - overflow)
    } else {
      c = 0
    }
    var appended = 0
    for (var i = i4; i < size; i++) {
      var d = digits(json[i])
      var one = 0
      var ones = 0
      var nums = 0
      if (_len == 1 && digit > d) {
        var x = json[i] - 10 ** (d - 1)
        var i2 = 1
        while (i2 < d) {
          var len = (x / 10 ** (d - i2 - 1)) >> 0
          x = x - len * 10 ** (d - i2 - 1)
          if (len == 1) {
            if (ones == 0) one = i2
            ones++
          } else if (len !== 0) {
            ones = 0
            nums = 0
          } else {
            one = i2
          }
          i2++
          if (len == 0) {
            var len3 = (x / 10 ** (d - i2 - 1)) >> 0
            x = x - len3 * 10 ** (d - i2 - 1)
            i2++
            ones = len3
            for (var i3 = 0; i3 < len3; i3++) {
              var len2 = (x / 10 ** (d - i2 - 1)) >> 0
              x = x - len2 * 10 ** (d - i2 - 1)
              nums = nums * 10 + len2
              i2++
            }
          } else {
            for (var i3 = 0; i3 < len; i3++) {
              var len2 = (x / 10 ** (d - i2 - 1)) >> 0
              x = x - len2 * 10 ** (d - i2 - 1)
              if (len == 1) nums = nums * 10 + len2
              i2++
            }
          }
        }
        if (ones == 2) nums = nums * 10 + _c
      }
      if (ones > 2) {
        var x = (json[i] / 10 ** (d - one - 1)) >> 0
        x = x * 10 + ones + 1
        x = x * 10 ** ones + nums
        x = x * 10 + _c
        json[i] = x
        i4 = i
        appended = 1
      } else if (ones == 2) {
        var x = (json[i] / 10 ** (d - one)) >> 0
        x = x * 10 + 0
        x = x * 10 + ones + 1
        x = x * 10 ** (ones + 1) + nums
        json[i] = x
        i4 = i
        appended = 1
      } else if (digit > d + _len && appended == 0) {
        if (json[i] == 0) json[i] = 1
        json[i] = json[i] * 10 + _len2
        json[i] = json[i] * 10 ** _len + _c
        i4 = i
        appended = 1
      }
    }
  }
  return json
}

const next = (json, c) => {
  if (c[5] == 1) {
    return [0, c[1], 0, 0, 0, 1, c[6], c[7], c[8]]
  }
  var prev = 0
  for (var j = c[2]; j < c[1]; j++) {
    var d = digits(json[j])
    if (json[j] > 0) {
      var p = c[4] == 0 ? digits(json[j]) : c[4]
      var x = c[4] == 0 ? json[j] : c[3]
      var cur = 0
      var num = 0
      var on = c[4] == 0 ? 0 : c[7]
      var len = c[4] == 0 ? 0 : c[8]
      while (p > 0) {
        var n = (x / 10 ** (p - 1)) >> 0 // var n = x \ 10 ** (p - 1)
        if (on == 0) {
          on = 1
        } else if (on == 1) {
          if (n == 0) {
            on = 4
          } else {
            if (n == 9) {
              len = 8
              on = 3
            } else {
              on = 2
              len = n
            }
            cur = 0
          }
        } else if (on == 4) {
          on = 5
          len = n
        } else {
          num += n * 10 ** (len - cur - 1)
          cur++
          if (on == 5) {
            num = n
            len--
            x -= 10 ** (p - 1) * n
            p--
            var done = 0
            if (p == 0) {
              j++
              if (c[1] == j || json[j] == 0) {
                x = 0
                done = 1
              } else {
                x = json[j]
              }
            }
            if (len == 0) on = 1
            return [num, c[1], j, x, p, done, c[6], on, len]
          } else if (cur == len) {
            prev *= 10 ** len
            if (on == 3) {
              prev += num
            } else {
              num += prev
              x -= 10 ** (p - 1) * n
              p--
              var done = 0
              if (p == 0) {
                j++
                if (c[1] == j || json[j] == 0) {
                  x = 0
                  done = 1
                } else {
                  x = json[j]
                }
              }
              return [num, c[1], j, x, p, done, c[6], 1, len]
            }
            cur = 0
            on = 1
            len = 0
            num = 0
          }
        }
        x -= 10 ** (p - 1) * n
        p--
      }
    } else {
      return [0, c[1], 0, 0, 0, 1, c[6], 0, 0]
    }
  }
  return [0, c[1], 0, 0, 0, 1, c[6], 0, 0]
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
  popArray
}
