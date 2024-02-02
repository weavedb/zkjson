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

    var _json_[9] = [0, size_json, 0,0,0,0,0,0,0];
 
    var contains[101];

    var _val_[9] = [0, size_val, 0,0,0,0,0,0,0];
    _val_ = g(val, _val_);
    var op = _val_[0];
    var _exists = op == 21 ? 1 : 0;

    while(_json_[5] == 0){ 
        _json_ = g(json, _json_);
        var _path_start[9] = _json_;
        _json_ = getPath(json, _json_, 1);
        var pi = _json_[6];

         _json_ = g(json, _json_);
        var _val_start[9] = _json_;
        _json_ = getVal(json, _json_);
        var vi = _json_[6];

        var match[2] = checkPathMatch(json, path, _path_start, size_path, pi);
        var path_match = match[0];
        var path_partial_match = match[1];

        var plus = op >= 10 ? 1 : 0;
        if(path_match == 1){
            var _val_match = 1;
            if(op >= 12 && op <= 15){
                _val_match = checkGtLt(op, _val_, _val_start, json, val, _val_match);
            } else if(op == 16 || op == 17){
                _val_match = checkInNin(op, _val_, _val_start, json, val, vi, _val_match);
            } else {
                _val_match = checkValMatch (json, val, _val_start, plus, size_val, vi, _val_match);
            }
            if(_val_match == 1){
                if(op != 11) _exists = 1;
            }else {
                if(op == 11) _exists = 1;
            }
        }else if(path_partial_match == 1 && ((op == 21 && _exists == 1) || (op != 21 && _exists == 0))){
            if(op == 19 || op == 20 || op == 21){
                contains = checkArrayContains(_exists, op, _val_, _val_start, vi, val, json, contains);
                _exists = contains[100];
            }else if(op == 18){
                _exists = checkContains(_exists, size_val, val, _val_start, vi, json, plus);
             } else {
                _exists = checkPartialMatch(_exists, size_path, size_val, path, _path_start, pi, val, _val_start, vi, json);
            }
        }
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