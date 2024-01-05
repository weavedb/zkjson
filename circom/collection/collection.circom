 pragma circom 2.1.5;
include "../../node_modules/circomlib/circuits/smt/smtverifier.circom";
include "../json/json.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template Collection (size_json,size) {  
    signal input path[size];
    signal input val[size];
    signal input siblings[25];
    signal input value;
    signal input root;
    signal input key;
    signal output exist;
    signal json[size_json];
    signal ex;
    component smtVerifier = SMTVerifier(25);
    component hash = Poseidon(1);

    hash.inputs[0] <== value;
    smtVerifier.enabled <== 1;
    smtVerifier.fnc <== 0;
    smtVerifier.oldKey <== 0;
    smtVerifier.oldValue <== 0;
    smtVerifier.isOld0 <== 0;
    smtVerifier.root <== root;
    smtVerifier.siblings <== siblings;
    smtVerifier.key <== key;
    smtVerifier.value <== hash.out;    
    var _exists = 0;
    var x = value;
    var i = 0;
    while(x > 0){
        x = x \ 10;
        i++;
    }
    var i2 = 1;
    x = value;
    var num = 0;
    var cur = 6;
    var index = 0;
    var json2[size_json];
    for(var i3 = i;i3 > 0; i3--){
        var n = x \ 10 ** (i3 - 1);
        if(i3 < i){
            num += n * 10 ** cur;
            if(cur == 0){
                index = ((i - i3) \ 7) - 1;
                json2[((i - i3) \ 7) - 1] = num;
                num = 0;
                cur = 6;
            }else{
                cur--;
            }
        }
        x -= 10 ** (i3 - 1) * n;
    }
    for(var i4 = index + 1;i4 < size_json; i4++) json2[i4] = 0;
    for(var i4 = 0;i4<size_json;i4++) json[i4] <-- json2[i4];         

    component _json = JSON(size_json, size);
    _json.json <== json;
    _json.path <== path;
    _json.val <== val;
    exist <== _json.exist;
}