pragma circom 2.1.5;
include "../../node_modules/circomlib/circuits/smt/smtprocessor.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template Query (level_col, level, size_json, size) {
    signal input siblings[level];
    signal input json[size_json];
    signal input newRoot;
    signal input newKey;
    signal input oldRoot;
    signal input isOld0;
    signal input oldValue;
    signal input oldKey;
    signal input oldRoot_db;
    signal input oldKey_db;
    signal input oldValue_db;
    signal input isOld0_db;
    signal input fnc[2];
    signal input siblings_db[level_col];
    signal input newKey_db;
        
    signal output new_root;
    
    component colVerifier = SMTProcessor(level);
    component all_hash = Poseidon(16);
    component _hash[16];
    for(var i = 0; i < 16; i++){
      _hash[i] = Poseidon(16);
      for(var i2 = 0; i2 < 16; i2++){
        _hash[i].inputs[i2] <== json[i * 16 + i2];
      }
      all_hash.inputs[i] <== _hash[i].out;
    } 
    colVerifier.fnc[0] <== fnc[0];
    colVerifier.fnc[1] <== fnc[1];
    colVerifier.oldRoot <== oldRoot;
    colVerifier.oldKey <== oldKey;
    colVerifier.oldValue <== oldValue;
    colVerifier.isOld0 <== isOld0;
    colVerifier.siblings <== siblings;
    colVerifier.newKey <== newKey;
    colVerifier.newValue <== all_hash.out;
    component hash2 = Poseidon(1);
    hash2.inputs[0] <== colVerifier.newRoot;
    component dbVerifier = SMTProcessor(level_col);
    var any = fnc[0] + fnc[1];    
    dbVerifier.fnc[0] <== 0;
    dbVerifier.fnc[1] <== any * 1;
    dbVerifier.oldRoot <== oldRoot_db;
    dbVerifier.oldKey <== oldKey_db;
    dbVerifier.oldValue <== oldValue_db;
    dbVerifier.isOld0 <== isOld0_db;
    dbVerifier.siblings <== siblings_db;
    dbVerifier.newKey <== newKey_db;
    dbVerifier.newValue <== hash2.out;
    new_root <== dbVerifier.newRoot;
    new_root === newRoot;   
}