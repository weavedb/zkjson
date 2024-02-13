pragma circom 2.1.5;
include "../utils/uint.circom";
include "./parse.circom";

template IPFS (size) {
    signal input encoded[size];
    signal output json[size];
    var _json[size];
    var _path[size];
    var _val[size];
    var _temp[size];
    _json = parse(encoded, size, _path, _val, _json, _temp);
    json <-- _json;
}