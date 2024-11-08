pragma circom 2.1.5;
include "../query/query.circom";

template Rollup (tx_size, level_col, level, size_json) {
    signal input fnc[tx_size][2];
    signal input siblings[tx_size][level];
    signal input json[tx_size][size_json];
    signal input newKey[tx_size];
    signal input oldRoot[tx_size];
    signal input newRoot[tx_size];
    signal input isOld0[tx_size];
    signal input oldValue[tx_size];
    signal input oldKey[tx_size];
    signal input oldRoot_db[tx_size];
    signal input oldKey_db[tx_size];
    signal input oldValue_db[tx_size];
    signal input isOld0_db[tx_size];
    signal input siblings_db[tx_size][level_col];
    signal input newKey_db[tx_size];
    
    signal output new_root;
    component query[tx_size];
    for(var i = 0;i < tx_size;i++){
        query[i] = Query(level_col, level, size_json);
        query[i].fnc <== fnc[i];
        query[i].siblings <== siblings[i];
        query[i].json <== json[i];
        query[i].newKey <== newKey[i];
        query[i].oldRoot <== oldRoot[i];
        query[i].newRoot <== newRoot[i];
        query[i].isOld0 <== isOld0[i];
        query[i].oldValue <== oldValue[i];
        query[i].oldKey <== oldKey[i];
        query[i].oldRoot_db <== oldRoot_db[i];
        query[i].oldKey_db <== oldKey_db[i];
        query[i].oldValue_db <== oldValue_db[i];
        query[i].isOld0_db <== isOld0_db[i];
        query[i].siblings_db <== siblings_db[i];
        query[i].newKey_db <== newKey_db[i];
        if(i > 0) query[i - 1].new_root === query[i].oldRoot_db;
    } 
    new_root <== query[tx_size - 1].new_root; 
}