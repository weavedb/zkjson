pragma circom 2.1.5;
include "./query.circom";

component main {public [oldRoot]} = Query(8, 32, 256);