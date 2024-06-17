pragma circom 2.1.5;

include "../../node_modules/circomlib/circuits/smt/smtverifier.circom";
include "../json/json.circom";

template Collection (level, size_json, size_path, size_val) {  
    signal input path[size_path];
    signal input val[size_val];
    signal input siblings[level];
    signal input root;
    signal input key;
    signal output exist;
    signal input json[size_json];

    component smtVerifier = SMTVerifier(level);

    component _json = JSON(size_json, size_path, size_val);
    _json.json <== json;
    _json.path <== path;
    _json.val <== val;
    exist <== _json.exist;

    smtVerifier.enabled <== 1;
    smtVerifier.fnc <== 0;
    smtVerifier.oldKey <== 0;
    smtVerifier.oldValue <== 0;
    smtVerifier.isOld0 <== 0;
    smtVerifier.root <== root;
    smtVerifier.siblings <== siblings;
    smtVerifier.key <== key;
    smtVerifier.value <== _json.hash; 
}