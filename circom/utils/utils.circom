pragma circom 2.1.5;

function digits (x) {
    var p = 0;
    while(x > 0){
        x = x \ 10;
        p++;
    }
    return p;
}

function g(json, _c){
    if(_c[5] == 1){
        return [0, _c[1], 0, 0, 0, 1, _c[6], _c[7], _c[8]];
    }
    var prev = 0;
    for(var j = _c[2]; j < _c[1]; j++){
        if(json[j] > 0){
            var p = _c[4] == 0 ? digits(json[j]) : _c[4];
            var x = _c[4] == 0 ? json[j] : _c[3];
            var on = 0;
            var cur = 0;
            var len = 0;
            var num = 0;
            var is9 = 0;
            while(p > 0){
                var n = x \ 10 ** (p - 1);
                if(on == 0 && n > 0){
                    on = 1;
                    if(n == 9){
                        len = 8;
                        is9 = 1;
                    }else{
                        len = n;
                        is9 = 0;
                    }
                    cur = 0;
                }else if(on == 1){ 
                    num += n * 10 ** (len - cur - 1);
                    cur++;
                    if(cur == len){
                        prev *= 10 ** len;
                        if(is9 == 1){
                            prev += num;
                        }else{
                            num += prev;
                            prev = 0;
                            x -= 10 ** (p - 1) * n;
                            p--;
                            var done = 0;
                            if(p == 0) {
                                j++;
                                if(_c[1] == j || json[j] == 0){
                                    x = 0;
                                    done = 1;
                                }else{
                                 x = json[j];
                                }
                            }
                            return [num, _c[1], j, x, p, done, _c[6], _c[7], _c[8]];
                        }
                        cur = 0;
                        on = 0;
                        len = 0;
                        num = 0;
                        is9 = 0;
                    }
                }
                x -= 10 ** (p - 1) * n;
                p--;
            }
        }else{
            return [0, _c[1], 0, 0, 0, 1, _c[6], _c[7], _c[8]];
        }
    }
    return [0, _c[1], 0, 0, 0, 1, _c[6], _c[7], _c[8]];
}

function toArr(size_json, json, _len, _json){
    var ji = 0;
    var prev = 0;
    for(var j = 0; j < size_json; j++){
        if(json[j] > 0){
            var p = digits(json[j]);
            var x = json[j];
            var on = 0;
            var cur = 0;
            var len = 0;
            var num = 0;
            var is9 = 0;
            while(p > 0){
                var n = x \ 10 ** (p - 1);
                if(on == 0 && n > 0){
                    on = 1;
                    if(n == 9){
                        len = 8;
                        is9 = 1;
                    }else{
                        len = n;
                        is9 = 0;
                    }
                    cur = 0;
                }else if(on == 1){ 
                    num += n * 10 ** (len - cur - 1);
                    cur++;
                    if(cur == len){
                        prev *= 10 ** len;
                        if(is9 == 1){
                            prev += num;
                        }else{
                            num += prev;
                            prev = 0;
                            _json[ji + _len] = num;
                            ji++;
                        }
                        cur = 0;
                        on = 0;
                        len = 0;
                        num = 0;
                        is9 = 0;
                    }
                }
                x -= 10 ** (p - 1) * n;
                p--;
            }
        }
    }
    if(_len == 1) _json[0] = ji;
    return _json;
}


function getLen(size_json, json){
    var ji = 0;
    var prev = 0;
    for(var j = 0; j < size_json; j++){
        if(json[j] > 0){
            var p = digits(json[j]);
            var x = json[j];
            var on = 0;
            var cur = 0;
            var len = 0;
            var num = 0;
            var is9 = 0;
            while(p > 0){
                var n = x \ 10 ** (p - 1);
                if(on == 0 && n > 0){
                    on = 1;
                    if(n == 9){
                        len = 8;
                        is9 = 1;
                    }else{
                        len = n;
                        is9 = 0;
                    }
                    cur = 0;
                }else if(on == 1){ 
                    num += n * 10 ** (len - cur - 1);
                    cur++;
                    if(cur == len){
                        prev *= 10 ** len;
                        if(is9 == 1){
                            prev += num;
                        }else{
                            num += prev;
                            prev = 0;
                            ji++;
                        }
                        cur = 0;
                        on = 0;
                        len = 0;
                        num = 0;
                        is9 = 0;
                    }
                }
                x -= 10 ** (p - 1) * n;
                p--;
            }
        }else{
            return ji;
        }
    }
    return ji;
}

function checkPartialMatch(_exists, size_path, size_val, path, _path_start, pi, path_len, val, _val_start, vi, json){
    var pi3 = 0;
    var pi4 = 0;
    var partial_path[9];
    var partial_val[9];
    var path_diff = 0;

    var _path2_[9] = [0, size_path, 0,0,0,0,0,0,0];
    _path2_ = g(path, _path2_);
    var _path3_[9] = _path_start;
    path_diff = _path3_[0] - _path2_[0];


    for(var i5 = 0; i5  < path_len; i5++) _path3_ = g(json, _path3_);     
    partial_path = _path3_;

    for(var i5 = path_len; i5  < pi; i5++){
        var p3 = pi > i5 ? _path3_[0] : 0;
        _path3_ = g(json, _path3_);
        pi3++;
    }

    var _val3_[9] = _val_start;
    partial_val = _val3_;
    for(var i5 = 0; i5  < vi; i5++){
        _val3_ = g(json, _val3_);
        pi4++;
    }

    if(path_diff > 0){
        var val_match = 1;
        var _val2_[9] = [0, size_val, 0,0,0,0,0,0,0];
        var i5 = 0;
        while(_val2_[5] == 0 || i5 < 2 + pi3 + pi4){
            _val2_ = g(val, _val2_);
            var pval = i5 == 0 ? 4 : 0;
            if(i5 == 1) pval = path_diff;
            if(i5 > 1 && i5 < 2 + pi3){
                pval = partial_path[0];
                partial_path = g(json, partial_path);
            }else if(i5 >= 2 + pi3 && i5 < 2 + pi3 + pi4){
                pval = partial_val[0];
                partial_val = g(json, partial_val);
            }
            if(pval != _val2_[0]) val_match = 0;
            i5++;
        }
        if(val_match == 1) _exists = 1;
    }
    return _exists;
}

function getPath(json, _json_, pi){
    var len = _json_[0];
    for(var i2 = 0; i2 < len; i2++){
        _json_ = g(json, _json_);
        var plen = _json_[0];
        pi++;
        var plen2 = plen;
        if(plen == 0){
            _json_ = g(json, _json_);
            pi++;
            if(_json_[0] == 0){
                _json_ = g(json, _json_);
                pi++;                    
            }
        }else{
            for(var i3 = 0; i3 < plen2; i3++){
                _json_ = g(json, _json_);
                pi++;
            }
        }
    }
    _json_[6] = pi;
    return _json_;
}

function getVal(json, _json_){
    var type = _json_[0];
    var vi = 0;
    if(type == 1){
        _json_ = g(json, _json_);
        vi = 2;
    }else if(type == 2){
        _json_ = g(json, _json_);
        _json_ = g(json, _json_);
        _json_ = g(json, _json_);
        vi = 4;
    } else if (type == 3){
        _json_ = g(json, _json_);
        var slen =  _json_[0];
        for(var i3 = 0;i3 < slen; i3++){
            _json_ = g(json, _json_);
        }
        vi = slen + 2;
    } else {
        vi = 1;
    }
    _json_[6] = vi;
    return _json_;
}

function checkPathMatch(json, path, _path_start, size_path, path_len, pi){
    var path_match = 1;
    var path_partial_match = 1;
    var _path2_[9] = [0, size_path, 0,0,0,0,0,0,0];
    var _path3_[9] = _path_start;
    var i4 = 0;
    while(i4 < pi || _path2_[5] == 0){
        _path2_ = g(path, _path2_);
        var p3 = pi > i4 ? _path3_[0] : 0;
        if(p3 != _path2_[0]){
            path_match = 0;
            if(path_len > i4 && i4 != 0) path_partial_match = 0;
        }
        _path3_ = g(json, _path3_);
        i4++;
    }
    return [path_match, path_partial_match];
}

function checkValMatch (json, val, _val_start, plus, size_val, vi, _val_match) {
    var _val_[9] = [0, size_val, 0,0,0,0,0,0,0];
    if(plus == 1) _val_ = g(val, _val_);
    var _val3_[9] = _val_start;
    var i5 = 0;
    while(vi > i5 || _val_[5] == 0){
        _val_ = g(val, _val_);
        var v3 = vi > i5 ? _val3_[0] : 0;
        if(v3 != _val_[0]) _val_match = 0;
        _val3_ = g(json, _val3_);
        i5++;
    }
    return _val_match;
}

function checkGtLt (op, _val_, _val_start, json, val, _val_match) {
    var rev = op == 14 || op == 15;
    var eq = op == 13 || op == 15;
    var matched = 0;
    var _val2_[9] = _val_;
    _val2_ = g(val, _val2_);
    var _val3_[9] = _val_start;

    if(_val2_[0] != _val3_[0] || (_val2_[0] != 2 && _val2_[0] != 3 && _val2_[0] != 1)) _val_match = 0;
    if(_val2_[0] == 2 && _val_match == 1){
        var sign = 2;
        _val2_ = g(val, _val2_);
        var val2_2 = _val2_[0];
        _val3_ = g(json,_val3_);
        var val3_1 = _val3_[0];
        if(_val2_[0] == 0 && val3_1 == 0) sign = 0;
        if(_val2_[0] == 1 && val3_1 == 1) sign = 1;
        _val2_ = g(val, _val2_);
        _val3_ = g(json,_val3_);
        var val3_2 = _val3_[0];                    
        _val3_ = g(json,_val3_);
        var val3_3 = _val3_[0];                                        
            _val3_ = g(json,_val3_);
        if(_val2_[0] == 0 && _val3_[0] == 0 && eq) matched = 1;

        if(matched == 0 && _val_match == 1){
            var mul2 = 1;
            var mul = 1;
            if(_val2_[0] > val3_2) mul = 10 ** (_val2_[0] - val3_2);
            if(_val2_[0] < val3_2) mul2 = 10 ** (val3_2 - _val2_[0]);
            if(rev == 0){
                if(val2_2 == 1 && val3_1 == 0) _val_match = 0;
                if(_val2_[0] == 0 && _val3_[0] == 0 && eq) matched = 1;
                if(_val_match == 1){
                    _val2_ = g(val, _val2_);
                    if(sign == 1){
                        if((eq == 0 && _val2_[0] * mul2 >= val3_3 * mul) || (eq == 1 && _val2_[0] * mul2 > val3_3 * mul)) _val_match = 0;
                    }else if(sign == 0){
                        if((eq == 0 && _val2_[0] * mul2 <= val3_3 * mul) || (eq == 1 && _val2_[0] * mul2 < val3_3 * mul)) _val_match = 0;
                    }
                }
            }else{
                if(val2_2 == 0 && val3_1 == 1) _val_match = 0;
                if(_val_match == 1){
                    _val2_ = g(val, _val2_);
                    if(sign == 1){
                        if((eq == 0 && _val2_[0] * mul2 <= val3_3 * mul) || (eq == 1 && _val2_[0] * mul2 < val3_3 * mul)) _val_match = 0;
                    }else if(sign == 0){
                        if((eq == 0 && _val2_[0] * mul2 >= val3_3 * mul) || (eq == 1 && _val2_[0] * mul2 > val3_3 * mul)) _val_match = 0;
                    }
                }                  
            }
        }
    } else if(_val2_[0] == 3 && _val_match == 1){
        _val2_ = g(val, _val2_);
        var val2_2 = _val2_[0];
        _val3_ = g(json,_val3_);
        var val3_1 = _val3_[0];
        var str_size = _val2_[0] > _val3_[0] ? _val3_[0] : _val2_[0];
        var eql = 1;
        if(op == 12 || op == 13){
            for(var i3 = 0; i3 < str_size; i3++){
                _val2_ = g(val, _val2_);
                _val3_ = g(json,_val3_);
                if(_val2_[0] > _val3_[0]) _val_match = 0;
                if(_val2_[0] != _val3_[0]) eql = 0;
            }
            if(_val_match == 1){
                if(val2_2 > str_size) _val_match = 0;
                if (eql && val2_2 == val3_1 && op == 12) _val_match = 0;
            }
        } else if(op == 14 || op == 15){
            for(var i3 = 0; i3 < str_size; i3++){
                _val2_ = g(val, _val2_);
                _val3_ = g(json,_val3_);
                if(_val2_[0] < _val3_[0]) _val_match = 0;
                if(_val2_[0] != _val3_[0]) eql = 0;
            }
            if(_val_match == 1){
                if(val3_1 > str_size) _val_match = 0;
                if (eql && val2_2 == val3_1 && op == 14) _val_match = 0;
            }
        }
    } else if(_val2_[0] == 1 && _val_match == 1){
        _val2_ = g(val, _val2_);
        _val3_ = g(json,_val3_);
        if(eq == 0 && _val2_[0] == _val3_[0]) _val_match = 0;
        if(eq == 1 && _val2_[0] != _val3_[0]) _val_match = 0;
        if(eq == 1 && _val2_[0] == _val3_[0]) matched = 1;
        if(_val_match == 1 && matched == 0){
            if(op == 12 || op == 13){
                if(_val2_[0] > _val3_[0]) _val_match = 0;
            } else if(op == 14 || op == 15){
                if(_val2_[0] < _val3_[0]) _val_match = 0;
            }
        }
    }
    return _val_match;
}

function checkInNin (op, _val_, _val_start, json, val, vi, _val_match){
    var _val2_[9] = _val_;
    _val2_ = g(val, _val2_);
    if(_val2_[0] != 4) _val_match = 0;
    if(_val_match == 1){
        _val2_ = g(val, _val2_);
        var plen2 = _val2_[0];
        var included = 0;
        while(plen2 > 0){
            _val2_ = g(val, _val2_);
            var _next_[9] = g(val, _val2_);
            if(_val2_[0] != 0  || _next_[0] != 0){
                plen2 = 0;
            }else{
                _val2_ = g(val, _val2_);
                _val2_ = g(val, _val2_);
                _val2_ = g(val, _val2_);
                var type2 = _val2_[0];
                var _val4_[9] = _val2_;
                var vi4 = 0;
                var _val_match2 = 1;
                var matched2 = 0;
                if(type2 == 0){
                    _val2_ = g(val, _val2_);
                    plen2 = _val2_[0];
                    vi4 = 1;
                }else if(type2 == 1){
                    _val2_ = g(val, _val2_);
                    _val2_ = g(val, _val2_);
                    plen2 = _val2_[0];
                    vi4 = 2;
                }else if(type2 == 2){
                    _val2_ = g(val, _val2_);
                    _val2_ = g(val, _val2_);
                    _val2_ = g(val, _val2_);
                    _val2_ = g(val, _val2_);
                    plen2 = _val2_[0];
                    vi4 = 4;
                } else if (type2 == 3){
                    _val2_ = g(val, _val2_);
                    var slen2 =  _val2_[0];
                    for(var i6 = 0;i6 < slen2; i6++){
                        _val2_ = g(val, _val2_);
                    }
                    _val2_ = g(val, _val2_);
                    plen2 = _val2_[0];
                    vi4 = slen2 + 2;
                } else {
                    _val_match2 = 0;
                    plen2 = 0;
                    matched2 = 1;
                }
                if(_val_match2 == 1 && matched2 == 0){
                    var _val3_[9] = _val_start;
                    var i5 = 0;
                    while(vi > i5 || vi4 > i5){
                        var v3 = vi > i5 ? _val3_[0] : 0;
                        var v4 = vi4 > i5 ? _val4_[0] : 0;
                        if(v4 != v3) _val_match2 = 0;
                        _val3_ = g(json, _val3_);
                        _val4_ = g(val, _val4_);
                        i5++;
                    }
                }
                if(_val_match2 == 1){
                    matched2 = 1;
                    included = 1;
                }
            }
        }
        if((op == 17 && included == 1) || (op == 16 && included == 0)) _val_match = 0;
    }
    return _val_match;
}

function checkContains (_exists, size_val, val, _val_start, vi, json, plus){
    var _pval_match = 1;
    var _val2_[9] = [0, size_val, 0,0,0,0,0,0,0];
    if(plus == 1) _val2_ = g(val, _val2_);
    var _val3_[9] = _val_start;
    var i5 = 0;
    while(vi > i5 || _val2_[5] == 0){    
        _val2_ = g(val, _val2_);
        var v3 = vi > i5 ? _val3_[0] : 0;
        if(v3 != _val2_[0]) _pval_match = 0;
        _val3_ = g(json, _val3_);
        i5++;
    }
    if(_pval_match == 1) _exists = 1;
   return _exists;
}

function checkArrayContains (_exists, op, _val_, _val_start, vi, val, json, contains) {
    var _val_match = 1;
    var _val2_[9] = _val_;
    _val2_ = g(val, _val2_);
    if(_val2_[0] != 4) _val_match = 0;
    _val2_ = g(val,_val2_);
    var plen3 = _val2_[0];
    var included = 0;
    var eindex = 0;
    while(plen3 > 0){
        _val2_ = g(val,_val2_);
        var _next_[9] = g(val, _val2_);
        if(_val2_[0] != 0  || _next_[0] != 0){
            plen3 = 0;
        }else{
            _val2_ = g(val,_val2_);
            _val2_ = g(val,_val2_);
            _val2_ = g(val,_val2_);
            var type2 = _val2_[0];
            var _val4_[9] = _val2_;
            var _val_match2 = 1;
            var matched2 = 0;
            var vi4 = 0;
            if(type2 == 0){
                contains[eindex] = 1;
                eindex += 1;
                _val2_ = g(val,_val2_);
                plen3 = _val2_[0];
                vi4 = 1;
            }else if(type2 == 1){
                _val2_ = g(val,_val2_);
                contains[eindex] = 1;                                
                eindex += 1;           
                _val2_ = g(val,_val2_);                     
                plen3 = _val2_[0];
                vi4 = 2;
            }else if(type2 == 2){
                _val2_ = g(val,_val2_);
                _val2_ = g(val,_val2_);
                _val2_ = g(val,_val2_);
                contains[eindex] = 1;                                
                eindex += 1;           
                _val2_ = g(val,_val2_);                     
                plen3 = _val2_[0];
                vi4 = 4;
            } else if (type2 == 3){
                _val2_ = g(val,_val2_);
                var slen2 =  _val2_[0];
                for(var i6 = 0;i6 < slen2; i6++){
                    _val2_ = g(val,_val2_);
                }
                contains[eindex] = 1;                                
                eindex += 1;
                _val2_ = g(val,_val2_);
                plen3 = _val2_[0];
                vi4 = slen2 + 2;
            } else {
                _val_match2 = 0;
                plen3 = 0;
                matched2 = 1;
            }
            if(_val_match2 == 1 && matched2 == 0){
                var matched3 = 1;
                var _val3_[9] = _val_start;
                var i5 = 0;
                while(_val3_[5] == 0 || _val4_[5] == 0){
                    var v3 = vi > i5 ? _val3_[0] : 0;
                    var v4 = vi4 > i5 ? _val4_[0] : 0;
                    if(v4 != v3){
                            _val_match2 = 0;
                            matched3 = 0;
                    }
                    _val3_ = g(json, _val3_);
                    _val4_ = g(val, _val4_);
                    i5++;
                }
                if(matched3 == 1){
                    contains[eindex - 1 + 50] = 1;
                }
            }
            if(_val_match2) included = 1;
        }               
    }
    if(included){
        if(op == 19){
            _exists = 1;
        }else if(op == 20){
            var all = 1;
            for(var i5 = 0; i5 < 50; i5++){
                if(contains[i5] == 1 && contains[i5 + 50] == 0) all = 0;
            }
            if(all == 1) _exists = 1;
        }else if(op == 21){
            _exists = 0;                      
        }
    }
    contains[100] = _exists;
    return contains;
}