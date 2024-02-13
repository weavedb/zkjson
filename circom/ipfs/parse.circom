pragma circom 2.1.5;
include "../utils/uint.circom";

function eql  (a, b, blen, size)  {
  var alen = length(a, size);
  if (alen != blen) return 0;
  var c[9] = [0, size, 0, 0, 0, 0, 0, 0, 0];
  for (var i = 0; i < blen; i++) {
    c = next(a, c);
    if (c[0] != b[i]) return 0;
  }
  return 1;
}

function constVal  (_v, type, size, val)  {
  var _true_[4] = [116, 114, 117, 101];
  
  val = push(val, size, 9, type);
  if (type == 1) {
    if (eql(_v, _true_, 4, size) == 1) {
      val = push(val, size, 9, 1);
    } else {
      val = push(val, size, 9, 0);
    }
  } else if (type == 3) {
    val = push(val, size, 9, length(_v, size));
    var c[9] = [0, size, 0, 0, 0, 0, 0, 0, 0];
    while (c[5] == 0) {
      c = next(_v, c);
      val = push(val, size, 9, c[0]);
    }
  } else if (type == 2) {
    if (get(_v, size, 0) == 45) {
      val = push(val, size, 9, 0);
    } else {
      val = push(val, size, 9, 1);
    }
    var after = 0;
    var right = 0;
    var digits = 0;
    var c[9] = [0, size, 0, 0, 0, 0, 0, 0, 0];
    while (c[5] == 0) {
      c = next(_v, c);
      if (c[0] == 46) {
        after = 1;
      } else if (c[0] != 45) {
        if (after == 1) right += 1;
        digits = digits * 10 + (c[0] - 48);
      }
    }
    val = push(val, size, 9, right);
    val = push(val, size, 9, digits);
  }
  return val;
}

function constPath  (p, size, pth2)  {
  var len = get(p, size, 0);
  pth2 = push(pth2, size, 9, len);
  for (var i = 0; i < len; i++) {
    var len2 = get(p, size, i + 1);
    var _sum = sum(p, size, 9, 1, 1 + i);
    var first = get(p, size, 1 + len + _sum);
    if (first == 0) {
      pth2 = push(pth2, size, 9, 0);
    } else {
      pth2 = push(pth2, size, 9, len2);
    }
    for (var i2 = 0; i2 < len2; i2++) {
      var v = get(p, size, 1 + len + _sum + i2);
      pth2 = push(pth2, size, 9, v);
    }
  }
  return pth2;
}

function isNumber  (val, size, digit) {
  var len = length(val, size);
  var c[9] = [0, size, 0, 0, 0, 0, 0, 0, 0];
  while (c[5] == 0) {
    c = next(val, c);
    if (c[0] == 47 || c[0] < 45 || c[0] > 57) return 0;
  }

  return 1;
}


function empty(_arr, size) {
  for(var i = 0; i < size; i++){
    _arr[i] = 0;
  }
  return _arr;
}

function parse  (str, size, path, val, json, temp) {
  var _null_[4] = [110, 117, 108, 108];
  var _true_[4] = [116, 114, 117, 101];
  var _false_[5] = [102, 97, 108, 115, 101];
  var inVal = 0;
  var isNum = 0;
  var esc = 0;
  var nextKey = 0;
  var arr = 0;
  var obj = 0;
  var ao[5];
  var ind[5];
  var err = 0;
  var c[9] = [0, size, 0, 0, 0, 0, 0, 0, 0];
  while (c[5] == 0) {
    c = next(str, c);
    var s = c[0];
    if (inVal == 1) {
      if (s == 92) {
        esc = 1;
      } else if (s == 34) {
        if (esc == 1) {
          val = push(val, size, 9, s);
        } else {
          inVal = 0;
          if (nextKey == 1 && last(ao, 5) == 1) {
            path = pushArray(path, size, 9, val, size, temp);
          } else {
            if (last(ao, 5) == 2) {
              var _ind = last(ind, 5);
              var __ind[5];
              __ind = push(__ind, 5, 9, 0);
              __ind = push(__ind, 5, 9, _ind);
              path = pushArray(path, size, 9, __ind, 5, temp);
              ind = pop(ind, 5);
              ind = push(ind, 5, 9, _ind + 1);
            }
            json = concat(
              json,
              concat(constPath(path, size, temp), constVal(val, 3, size, temp), size, 9),
              size,
              9
            );
            path = popArray(path, size, 9, temp);
          }

          val = empty(val, size);
          nextKey = 0;
        }
        esc = 0;
      } else {
        val = push(val, size, 9, s);
        esc = 0;
      }
    } else if (isNum == 1) {
      if (s == 44 || s == 32 || s == 125 || s == 93) {
        if (last(ao, 5) == 2) {
          var _ind = last(ind, 5);
          var __ind[5];
          __ind = push(__ind, 5, 9, 0);
          __ind = push(__ind, 5, 9, _ind);
          path = pushArray(path, size, 9, __ind, 5, temp);
          ind = pop(ind, 5);
          ind = push(ind, 5, 9, _ind + 1);
        }
        if (
          eql(val, _true_, 4, size) == 0 &&
          eql(val, _false_, 5, size) == 0 &&
          eql(val, _null_, 4, size) == 0 &&
          isNumber(val, size, 9) == 0
        ) {
          err = 1;
        }
        var type = 2;
        if (eql(val, _null_, 4, size) == 1) {
          type = 0;
        } else if (
          eql(val, _true_, 4, size) == 1 ||
          eql(val, _false_, 5, size) == 1
        ) {
          type = 1;
        }
        json = concat(
          json,
          concat(constPath(path, size, temp), constVal(val, type, size, temp), size, 9),
          size,
          9
        );
        path = popArray(path, size, 9, temp);
        if (s == 93) {
          if (last(ao, 5) != 2) err = 1;
          ao = pop(ao, 5);
          path = popArray(path, size, 9, temp);
          arr--;
          ind = pop(ind, 5);
        }
        if (s == 125) {
          if (last(ao, 5) != 1) err = 1;
          ao = pop(ao, 5);
          path = popArray(path, size, 9, temp);
          obj--;
        }
        isNum = 0;
        val = empty(val, size);
        if (s == 44) nextKey = 1;
      } else {
        val = push(val, size, 9, s);
      }
    } else if (s == 34) {
      inVal = 1;
    } else if (
      s != 123 &&
      s != 58 &&
      s != 32 &&
      s != 44 &&
      s != 91 &&
      s != 93 &&
      s != 125
    ) {
      isNum = 1;
      val = push(val, size, 9, s);
    } else {
      if (s != 32) {
        if (s == 123 || s == 44) nextKey = 1;
        if (s == 123) {
          if (last(ao, 5) == 2) {
            var _ind = last(ind, 5);
            var __ind[5];
            __ind = push(__ind, 5, 9, 0);
            __ind = push(__ind, 5, 9, _ind);
            path = pushArray(path, size, 9, __ind, 5, temp);
            ind = pop(ind, 5);
            ind = push(ind, 5, 9, _ind + 1);
          }
          ao = push(ao, 5, 9, 1);
          obj++;
        }
        if (s == 125) {
          if (last(ao, 5) != 1) err = 1;
          ao = pop(ao, 5);
          path = popArray(path, size, 9, temp);
          obj--;
        }
        if (s == 91) {
          if (last(ao, 5) == 2) {
            var _ind = last(ind, 5);
            var __ind[5];
            __ind = push(__ind, 5, 9, 0);
            __ind = push(__ind, 5, 9, _ind);
            path = pushArray(path, size, 9, __ind, 5, temp);
            ind = pop(ind, 5);
            ind = push(ind, 5, 9, _ind + 1);
          }
          ind = push(ind, 5, 9, 0);
          ao = push(ao, 5, 9, 2);
          arr++;
        }
        if (s == 93) {
          if (last(ao, 5) != 2) err = 1;
          ao = pop(ao, 5);
          ind = pop(ind, 5);
          path = popArray(path, size, 9, temp);
          arr--;
        }
      }
    }
  }
  if (length(val, size) != 0) {
    var type = 4;
    if (eql(val, _null_, 4, size) == 1) {
      type = 0;
      isNum = 0;
    } else if (eql(val, _true_, 4, size) == 1 || eql(val, _false_, 5, size)) {
      type = 1;
      isNum = 0;
    } else if (isNumber(val, size, 9) == 1) {
      type = 2;
      isNum = 0;
    }
    json = concat(
      json,
      concat(constPath(path, size, temp), constVal(val, type, size, temp), size, 9),
      size,
      9
    );
  }
  if (length(ao, 5) > 0) err = 1;
  if (length(ind, 5) > 0) err = 1;
  if (inVal) err = 1;
  if (isNum) err = 1;
  return json;
}
