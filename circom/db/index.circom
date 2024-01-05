pragma circom 2.1.5;
include "../../node_modules/circomlib/circuits/smt/smtverifier.circom";
include "../collection/collection.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template DB (size_json,size) {  
    signal input path[size];
    signal input val[size];
    signal input siblings[25];
    signal input col_siblings[25];
    signal input col_root;
    signal input col_key;
    signal input value;
    signal input root;
    signal input key;
    signal output exist;

    component smtVerifier = SMTVerifier(25);
    component hash = Poseidon(1);
    hash.inputs[0] <== root;
    smtVerifier.enabled <== 1;
    smtVerifier.fnc <== 0;
    smtVerifier.oldKey <== 0;
    smtVerifier.oldValue <== 0;
    smtVerifier.isOld0 <== 0;
    smtVerifier.root <== col_root;
    smtVerifier.siblings <== col_siblings;
    smtVerifier.key <== col_key;
    smtVerifier.value <== hash.out;   

    component _coll = Collection(size_json, size);
    _coll.path <== path;
    _coll.val <== val;
    _coll.siblings <== siblings;
    _coll.value <== value;
    _coll.root <== root;
    _coll.key <== key;
    exist <== _coll.exist;
}
component main {public [path, val, key]} = DB(1000,100);