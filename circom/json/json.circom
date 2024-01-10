pragma circom 2.1.5;

function digits (x) {
    var p = 0;
    while(x > 0){
        x = x \ 10;
        p++;
    }
    return p;
}

function toArr(size_json, json){
    var  _json[7500];
    var ji = 0;
    for(var j = 0; j < size_json; j++){
        if(json[j] > 0){
            var p = digits(json[j]);
            var x = json[j];
            var on = 0;
            var cur = 0;
            var len = 0;
            var num = 0;
            while(p > 0){
                var n = x \ 10 ** (p - 1);
                if(on == 0 && n > 0){
                    on = 1;
                    len = n;
                    cur = 0;
                }else if(on == 1){
                    num += n * 10 ** (len - cur - 1);
                    cur++;
                    if(cur == len){
                        _json[ji] = num;
                        ji++;
                        cur = 0;
                        on = 0;
                        len = 0;
                        num = 0;
                    }
                }
                x -= 10 ** (p - 1) * n;
                p--;
            }
        }
    }
    return _json;
}

template JSON (size_json, size) {  
    signal input json[size_json];  
    signal input path[size];
    signal input val[size];
    signal output exist;
    signal ex;
    var _exists = 0;
    var  _json[7500] = toArr(size_json, json);
    var  path2[7500] = toArr(size, path);
    var  val2[7500] = toArr(size, val);
    var i = 0;
    while(i < 7500){ 
        var _path[size];
        var len = _json[i];
        i++;
        _path[0] = len;
        var pi = 1;
        for(var i2 = 0; i2 < len; i2++){
            var plen = _json[i];
            _path[pi] = plen;
            pi++;
            i++;
            var plen2 = plen;
            if(plen == 0){
                plen2 = _json[i] == 0 ? 2 : 1;
            }
            for(var i3 = 0; i3 < plen2; i3++){
                _path[pi] = _json[i];
                pi++;
                i++;
            }
        }
        var type = _json[i];
        i++;
        var _val[size];
        _val[0] = type;
        if(type == 1){
            _val[1] = _json[i];
            i++; 
        }else if(type == 2){
            _val[1] = _json[i];
            i++;
            _val[2] = _json[i];
            i++;
            _val[3] = _json[i];
            i++;            
        } else if (type == 3){
            var slen =  _json[i];
            _val[1] = slen;
            i++;
            for(var i3 = 0;i3 < slen; i3++){
                _val[i3 + 2] = _json[i];
                i++;
            }
        }
        var path_match = 1;
        var val_match = 0;
        for(var i4 = 0; i4  < size; i4++){
            if(_path[i4] != path2[i4]){
                path_match = 0;
            }
        }
        if(path_match == 1){
            var _val_match = 1;
            for(var i5 = 0; i5  < size; i5++){
                if(_val[i5] != val2[i5]) _val_match = 0;
            }
            if(_val_match == 1) val_match = 1;
        }
        if(path_match == 1 && val_match == 1) _exists = 1;
    }
    ex <-- _exists;
    exist <== ex * ex;
}