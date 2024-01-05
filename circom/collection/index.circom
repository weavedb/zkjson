pragma circom 2.1.5;
include "../../node_modules/circomlib/circuits/smt/smtverifier.circom";
include "../json/json.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";
include "./collection.circom";

component main {public [path, val]} = Collection(1000,100);