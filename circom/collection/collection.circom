pragma circom 2.1.5;

include "../../node_modules/circomlib/circuits/smt/smtverifier.circom";
include "../json/json.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template Collection (level, size_json, size) {  
    signal input path[size];
    signal input val[size];
    signal input siblings[level];
    signal input root;
    signal input key;
    signal output exist;
    signal input json[size_json];
    
    component smtVerifier = SMTVerifier(level);
    component hash = Poseidon(size_json);
    for(var i = 0; i < size_json; i++){
        hash.inputs[i] <== json[i];
    }
    smtVerifier.enabled <== 1;
    smtVerifier.fnc <== 0;
    smtVerifier.oldKey <== 0;
    smtVerifier.oldValue <== 0;
    smtVerifier.isOld0 <== 0;
    smtVerifier.root <== root;
    smtVerifier.siblings <== siblings;
    smtVerifier.key <== key;
    smtVerifier.value <== hash.out; 
    component _json = JSON(size_json, size);
    _json.json <== json;
    _json.path <== path;
    _json.val <== val;
    exist <== _json.exist;
}