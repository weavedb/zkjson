pragma circom 2.1.5;

template JSON (size_json,size) {  
    signal input json[size_json];  
    signal input path[size];
    signal input val[size];
    signal output exist;
    signal ex;
    var _exists = 0;
    var i = 0;
    while(i < size_json){
        var _path[size];
        var len = json[i];
        i++;
        _path[0] = len;
        var pi = 1;
        for(var i2 = 0; i2 < len; i2++){
            var plen = json[i];
            _path[pi] = plen;
            pi++;
            i++;
            var plen2 = plen;
            if(plen == 0){
                plen2 = json[i] == 0 ? 2 : 1;
            }
            for(var i3 = 0; i3 < plen2; i3++){
                _path[pi] = json[i];
                pi++;
                i++;
            }
        }
        var type = json[i];
        i++;
        var _val[size];
        _val[0] = type;
        if(type == 1){
            _val[1] = json[i];
            i++; 
        }else if(type == 2){
            _val[1] = json[i];
            i++;
            _val[2] = json[i];
            i++;
            _val[3] = json[i];
            i++;            
        } else if (type == 3){
            var slen =  json[i];
            _val[1] = slen;
            i++;
            for(var i3 = 0;i3 < slen; i3++){
                _val[i3 + 2] = json[i];
                i++;
            }
        }
        var path_match = 1;
        var val_match = 0;
        for(var i4 = 0; i4  < size; i4++){
            if(_path[i4] != path[i4]){
                path_match = 0;
            }
        }
        if(path_match == 1){
            var _val_match = 1;
            for(var i5 = 0; i5  < size; i5++){
                if(_val[i5] != val[i5]) _val_match = 0;
            }
            if(_val_match == 1) val_match = 1;
        }
        if(path_match == 1 && val_match == 1) _exists = 1;
    }
    ex <-- _exists;
    exist <== ex * ex;
}