pragma circom 2.1.5;
include "./rollup.circom";

component main {public [oldRoot]} = Rollup(2, 20, 16, 5); 