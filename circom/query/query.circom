pragma circom 2.1.5;
include "../../node_modules/circomlib/circuits/smt/smtprocessor.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template Query (level, size_json,size) {
    signal input siblings[level];
    signal input value;
    signal input newKey;
    signal input oldRoot;
    signal input isOld0;
    signal input oldValue;
    signal input oldKey;
    signal input oldRoot_db;
    signal input oldKey_db;
    signal input oldValue_db;
    signal input isOld0_db;
    signal input siblings_db[level];
    signal input newKey_db;
    
    signal output new_root;

    component colVerifier = SMTProcessor(level);
    component hash = Poseidon(1);
    hash.inputs[0] <== value;
    colVerifier.fnc[0] <== 1;
    colVerifier.fnc[1] <== 0;
    colVerifier.oldRoot <== oldRoot;
    colVerifier.oldKey <== oldKey;
    colVerifier.oldValue <== oldValue;
    colVerifier.isOld0 <== isOld0;
    colVerifier.siblings <== siblings;
    colVerifier.newKey <== newKey;
    colVerifier.newValue <== hash.out;

    component hash2 = Poseidon(1);
    hash2.inputs[0] <== colVerifier.newRoot;
    component dbVerifier = SMTProcessor(level);
    dbVerifier.fnc[0] <== 0;
    dbVerifier.fnc[1] <== 1;
    dbVerifier.oldRoot <== oldRoot_db;
    dbVerifier.oldKey <== oldKey_db;
    dbVerifier.oldValue <== oldValue_db;
    dbVerifier.isOld0 <== isOld0_db;
    dbVerifier.siblings <== siblings_db;
    dbVerifier.newKey <== newKey_db;
    dbVerifier.newValue <== hash2.out;
    new_root <== dbVerifier.newRoot;
}