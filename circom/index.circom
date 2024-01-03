pragma circom 2.1.5;

template JSON () {  
    signal input json[5];  
    signal input path[3];
    signal input val[2];
    signal output exist;
    signal ex;
    var _exists = 0;
    var i = 0;
    var _path[3];
    while(i < 5){
        var len = json[i];
        i++;
        _path[0] = len;
        var pi = 1;
        for(var i2 = 0; i2 < len; i2++){
            var plen = json[i];
            _path[pi] = plen;
            pi++;
            i++;
            for(var i3 = 0; i3 < plen; i3++){
                _path[pi] = json[i];
                pi++;
                i++;
            }
        }
        var type = json[i];
        i++;
        var _val[2];
        _val[0] = type;
        if(type == 1 || type == 2){
            _val[1] = json[i];
            i++;
        } else if (type == 3){
            var slen =  json[i];
            i++;
            for(var i3 = 0;i3 < slen; i3++){
                _val[i3 + 1] = json[i];
                i++;
            }
        }
        var path_match = 1;
        var val_match = 0;
        for(var i4 = 0; i4  < 3; i4++){
            if(_path[i4] != path[i4]){
                path_match = 0;
            }
        }
        if(path_match == 1){
            var _val_match = 1;
            for(var i5 = 0; i5  < 2; i5++){
                if(_val[i5] != val[i5]) _val_match = 0;
            }
            if(_val_match == 1) val_match = 1;
        }
        if(path_match == 1 && val_match == 1) _exists = 1;
    }
    ex <-- _exists;
    exist <== ex * ex;
}

component main {public [path, val]} = JSON();