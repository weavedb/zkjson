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