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
        return [0, _c[1], 0, 0, 0, 1];
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
                            return [num, _c[1], j, x, p, done];
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
            return [0, _c[1], 0, 0, 0, 1];
        }
    }
    return [0, _c[1], 0, 0, 0, 1];
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
