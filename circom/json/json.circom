pragma circom 2.1.5;

include "../utils/utils.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template JSON (size_json, size_path, size_val) {  
    signal input json[size_json];  
    signal input path[size_path];
    signal input val[size_val];
    signal output exist;
    signal output hash;
    signal ex;

    var arr_val_size = size_val * 77;
    var arr_path_size = size_path * 77;
    var _json_[6] = [0, size_json, 0,0,0,0];
    var path_len = getLen(size_path, path);
    var partial[arr_val_size];
    partial[0] = 4;
    var pi2 = 1;
    var elms[arr_val_size];
    var contains[arr_val_size];
    var _val_[6] = [0, size_val, 0,0,0,0];
    _val_ = g(val, _val_);
    var op = _val_[0];
    var _exists = op == 21 ? 1 : 0;
    while(_json_[5] == 0){ 
        var vi = 0;
        var _path[arr_path_size];
        _json_ = g(json, _json_);
        var len = _json_[0];
        _path[0] = len;
        var pi = 1;
        for(var i2 = 0; i2 < len; i2++){
            _json_ = g(json, _json_);
            var plen = _json_[0];
            _path[pi] = plen;
            pi++;
            var plen2 = plen;
            if(plen == 0){
                _json_ = g(json, _json_);
                _path[pi] = _json_[0];
                pi++;
                if(_json_[0] == 0){
                    _json_ = g(json, _json_);
                    _path[pi] = _json_[0];
                    pi++;                    
                }
            }else{
                for(var i3 = 0; i3 < plen2; i3++){
                    _json_ = g(json, _json_);
                    _path[pi] = _json_[0];
                    pi++;
                }
            }
        }
        _json_ = g(json, _json_);
        var type = _json_[0];
        var _val[arr_val_size];
        _val[0] = type;
        if(type == 1){
            _json_ = g(json, _json_);
            _val[1] = _json_[0];
            vi = 2;
        }else if(type == 2){
            _json_ = g(json, _json_);
            _val[1] = _json_[0];
            _json_ = g(json, _json_);
            _val[2] = _json_[0];
            _json_ = g(json, _json_);
            _val[3] = _json_[0];
            vi = 4;
        } else if (type == 3){
            _json_ = g(json, _json_);
            var slen =  _json_[0];
            _val[1] = slen;
            for(var i3 = 0;i3 < slen; i3++){
                _json_ = g(json, _json_);
                _val[i3 + 2] = _json_[0];
            }
            vi = slen + 1;
        } else {
            vi = 1;
        }
        var path_match = 1;
        var val_match = 0;
        var path_partial_match = 1;
        var _path2_[6] = [0, size_path, 0,0,0,0];
         for(var i4 = 0; i4  < arr_path_size - 1; i4++){
            _path2_ = g(path, _path2_);
            if(_path[i4] != _path2_[0]){
                path_match = 0;
                if(path_len > i4 && i4 != 0) path_partial_match = 0;
            }
        }
        var plus = op >= 10 ? 1 : 0;
        var _val_match = 1;
        if(path_match == 1){
            if(op >= 12 && op <= 15){
                var rev = op == 14 || op == 15;
                var eq = op == 13 || op == 15;
                var matched = 0;
                var _val2_[6] = _val_;
                _val2_ = g(val, _val2_);
                if(_val2_[0] != _val[0] || (_val2_[0] != 2 && _val2_[0] != 3 && _val2_[0] != 1)) _val_match = 0;
                if(_val2_[0] == 2 && _val_match == 1){
                    var sign = 2;
                    _val2_ = g(val, _val2_);
                    var val2_2 = _val2_[0];
                    if(_val2_[0] == 0 && _val[1] == 0) sign = 0;
                    if(_val2_[0] == 1 && _val[1] == 1) sign = 1;
                    _val2_ = g(val, _val2_);
                    if(_val2_[0] == 0 && _val[4] == 0 && eq) matched = 1;
                    if(matched == 0 && _val_match == 1){
                        var mul2 = 1;
                        var mul = 1;
                        if(_val2_[0] > _val[2]) mul = 10 ** (_val2_[0] - _val[2]);
                        if(_val2_[0] < _val[2]) mul2 = 10 ** (_val[2] - _val2_[0]);
                        if(rev == 0){
                            if(val2_2 == 1 && _val[1] == 0) _val_match = 0;
                            if(_val2_[0] == 0 && _val[4] == 0 && eq) matched = 1;
                            if(_val_match == 1){
                                _val2_ = g(val, _val2_);
                                if(sign == 1){
                                    if((eq == 0 && _val2_[0] * mul2 >= _val[3] * mul) || (eq == 1 && _val2_[0] * mul2 > _val[3] * mul)) _val_match = 0;
                                }else if(sign == 0){
                                    if((eq == 0 && _val2_[0] * mul2 <= _val[3] * mul) || (eq == 1 && _val2_[0] * mul2 < _val[3] * mul)) _val_match = 0;
                                }
                            }
                        }else{
                            if(val2_2 == 0 && _val[1] == 1) _val_match = 0;
                            if(_val_match == 1){
                                _val2_ = g(val, _val2_);
                                if(sign == 1){
                                    if((eq == 0 && _val2_[0] * mul2 <= _val[3] * mul) || (eq == 1 && _val2_[0] * mul2 < _val[3] * mul)) _val_match = 0;
                                }else if(sign == 0){
                                    if((eq == 0 && _val2_[0] * mul2 >= _val[3] * mul) || (eq == 1 && _val2_[0] * mul2 > _val[3] * mul)) _val_match = 0;
                                }
                            }                  
                        }
                    }
                } else if(_val2_[0] == 3 && _val_match == 1){
                    _val2_ = g(val, _val2_);
                    var val2_2 = _val2_[0];
                    var str_size = _val2_[0] > _val[1] ? _val[1] : _val2_[0];
                    var eql = 1;
                    if(op == 12 || op == 13){
                        for(var i3 = 0; i3 < str_size; i3++){
                            _val2_ = g(val, _val2_);
                            if(_val2_[0] > _val[i3+2]) _val_match = 0;
                            if(_val2_[0] != _val[i3+2]) eql = 0;
                        }
                        if(_val_match == 1){
                            if(val2_2 > str_size) _val_match = 0;
                            if (eql && val2_2 == _val[1] && op == 12) _val_match = 0;
                        }
                    } else if(op == 14 || op == 15){
                        for(var i3 = 0; i3 < str_size; i3++){
                            _val2_ = g(val, _val2_);
                            if(_val2_[0] < _val[i3+2]) _val_match = 0;
                            if(_val2_[0] != _val[i3+2]) eql = 0;
                        }
                        if(_val_match == 1){
                            if(_val[1] > str_size) _val_match = 0;
                            if (eql && val2_2 == _val[1] && op == 14) _val_match = 0;
                        }
                    }
                } else if(_val2_[0] == 1 && _val_match == 1){
                    _val2_ = g(val, _val2_);
                    if(eq == 0 && _val2_[0] == _val[1]) _val_match = 0;
                    if(eq == 1 && _val2_[0] != _val[1]) _val_match = 0;
                    if(eq == 1 && _val2_[0] == _val[1]) matched = 1;
                    if(_val_match == 1 && matched == 0){
                        if(op == 12 || op == 13){
                            if(_val2_[0] > _val[1]) _val_match = 0;
                        } else if(op == 14 || op == 15){
                            if(_val2_[0] < _val[1]) _val_match = 0;
                        }
                    }
                }
            } else if(op == 16 || op == 17){
                var _val2_[6] = _val_;
                _val2_ = g(val, _val2_);
                if(_val2_[0] != 4) _val_match = 0;
                if(_val_match == 1){
                    _val2_ = g(val, _val2_);
                    var plen2 = _val2_[0];
                    var included = 0;
                    while(plen2 > 0){
                        _val2_ = g(val, _val2_);
                        var _next_[6] = g(val, _val2_);
                        if(_val2_[0] != 0  || _next_[0] != 0){
                            plen2 = 0;
                        }else{
                            _val2_ = g(val, _val2_);
                            _val2_ = g(val, _val2_);
                            _val2_ = g(val, _val2_);

                            var type2 = _val2_[0];
                            var _val3[arr_val_size];
                            _val3[0] = type2;
                            var _val_match2 = 1;
                            var matched2 = 0;
                            if(type2 == 0){
                                _val2_ = g(val, _val2_);
                                plen2 = _val2_[0];
                            }else if(type2 == 1){
                                _val2_ = g(val, _val2_);
                                _val3[1] = _val2_[0];
                                _val2_ = g(val, _val2_);
                                plen2 = _val2_[0];
                            }else if(type2 == 2){
                                _val2_ = g(val, _val2_);
                                _val3[1] = _val2_[0];
                                _val2_ = g(val, _val2_);
                                _val3[2] = _val2_[0];
                                _val2_ = g(val, _val2_);
                                _val3[3] = _val2_[0];
                                _val2_ = g(val, _val2_);
                                plen2 = _val2_[0];
                            } else if (type2 == 3){
                                _val2_ = g(val, _val2_);
                                var slen2 =  _val2_[0];
                                _val3[1] = slen2;
                                for(var i6 = 0;i6 < slen2; i6++){
                                    _val2_ = g(val, _val2_);
                                    _val3[i6 + 2] = _val2_[0];
                                }
                                _val2_ = g(val, _val2_);
                                plen2 = _val2_[0];
                            } else {
                                _val_match2 = 0;
                                plen2 = 0;
                                matched2 = 1;
                            }
                            if(_val_match2 == 1 && matched2 == 0){
                                for(var i5 = 0; i5  < arr_val_size; i5++){
                                    if(_val3[i5] != _val[i5]) _val_match2 = 0;
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
            } else {
                var _val_[6] = [0, size_val, 0,0,0,0];
                if(plus == 1) _val_ = g(val, _val_);
                for(var i5 = 0; i5  < arr_val_size - plus; i5++){
                    _val_ = g(val, _val_);
                    if(_val[i5] != _val_[0]) _val_match = 0;
                }
            }
            if(_val_match == 1){
                if(op != 11) val_match = 1;
            }else {
                if(op == 11) val_match = 1;
            }
        }else if(path_partial_match == 1 && ((op == 21 && _exists == 1) || (op != 21 && _exists == 0))){
            if(op == 19 || op == 20 || op == 21){
                var _val2_[6] = _val_;
                _val2_ = g(val, _val2_);
                if(_val2_[0] != 4) _val_match = 0;
                _val2_ = g(val,_val2_);
                var plen3 = _val2_[0];
                var included = 0;
                var eindex = 0;
                while(plen3 > 0){
                    _val2_ = g(val,_val2_);
                    var _next_[6] = g(val, _val2_);
                    if(_val2_[0] != 0  || _next_[0] != 0){
                        plen3 = 0;
                    }else{
                        _val2_ = g(val,_val2_);
                        _val2_ = g(val,_val2_);
                        _val2_ = g(val,_val2_);
                        var type2 = _val2_[0];
                        var _val3[arr_val_size];
                        _val3[0] = type2;
                        var _val_match2 = 1;
                        var matched2 = 0;
                        if(type2 == 0){
                            elms[eindex] = 1;
                            eindex += 1;
                            _val2_ = g(val,_val2_);
                            plen3 = _val2_[0];
                        }else if(type2 == 1){
                            _val2_ = g(val,_val2_);
                            _val3[1] = _val2_[0];
                            elms[eindex] = 1;                                
                            eindex += 1;           
                            _val2_ = g(val,_val2_);                     
                            plen3 = _val2_[0];
                        }else if(type2 == 2){
                            _val2_ = g(val,_val2_);
                            _val3[1] = _val2_[0];
                            _val2_ = g(val,_val2_);
                            _val3[2] = _val2_[0];
                            _val2_ = g(val,_val2_);
                            _val3[3] = _val2_[0];
                            elms[eindex] = 1;                                
                            eindex += 1;           
                            _val2_ = g(val,_val2_);                     
                            plen3 = _val2_[0];
                        } else if (type2 == 3){
                            _val2_ = g(val,_val2_);
                            var slen2 =  _val2_[0];
                            _val3[1] = slen2;
                            for(var i6 = 0;i6 < slen2; i6++){
                                _val2_ = g(val,_val2_);
                                _val3[i6 + 2] = _val2_[0];
                            }
                            elms[eindex] = 1;                                
                            eindex += 1;
                            _val2_ = g(val,_val2_);
                            plen3 = _val2_[0];
                        } else {
                            _val_match2 = 0;
                            plen3 = 0;
                            matched2 = 1;
                        }
                        if(_val_match2 == 1 && matched2 == 0){
                            var matched3 = 1;
                            for(var i5 = 0; i5  < arr_val_size; i5++){
                                if(_val3[i5] != _val[i5]){
                                     _val_match2 = 0;
                                     matched3 = 0;
                                }
                            }
                            if(matched3 == 1){
                                 contains[eindex - 1] = 1;
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
                        for(var i5 = 0; i5 < arr_val_size; i5++){
                            if(elms[i5] == 1 && contains[i5] == 0) all = 0;
                        }
                        if(all == 1) _exists = 1;
                    }else if(op == 21){
                        _exists = 0;                      
                    }
                }
            }else if(op == 18){
                var _pval_match = 1;
                var _val2_[6] = [0, size_val, 0,0,0,0];
                if(plus == 1) _val2_ = g(val, _val2_);
                for(var i5 = 0; i5  < arr_val_size - plus; i5++){
                    _val2_ = g(val, _val2_);
                    if(_val[i5] != _val2_[0]) _pval_match = 0;
                }
                if(_pval_match == 1) _exists = 1;
            } else {
                var path_diff = 0;
                var _path2_[6] = [0, size_path, 0,0,0,0];
                _path2_ = g(path, _path2_);
                for(var i5 = _path2_[0]; i5 < _path[0];i5++) path_diff++;
                partial[pi2] = path_diff;
                pi2++;
                for(var i5 = path_len; i5  < pi; i5++){
                    partial[pi2] = _path[i5];
                    pi2++;
                }
                for(var i5 = 0; i5  < vi; i5++){
                    partial[pi2] = _val[i5];
                    pi2++;
                }
            }
        }
        if(path_match == 1 && val_match == 1) _exists = 1;
    }
     if(pi2 > 1){
        var val_match = 1;
        var _val2_[6] = [0, size_val, 0,0,0,0];
        for(var i5 = 0; i5  < arr_val_size; i5++){
            _val2_ = g(val, _val2_);
            if(partial[i5] != _val2_[0]) val_match = 0;
        }
        if(val_match == 1) _exists = 1;
    }
    ex <-- _exists;
    exist <== ex * ex;

    component all_hash = Poseidon(16);
    component _hash[16];
    for(var i = 0; i < 16; i++){
      _hash[i] = Poseidon(16);
      for(var i2 = 0; i2 < 16; i2++){
        _hash[i].inputs[i2] <== json[i * 16 + i2];
      }
      all_hash.inputs[i] <== _hash[i].out;
    } 
    hash <== all_hash.out;
}