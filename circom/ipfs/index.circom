pragma circom 2.1.5;
include "./ipfs.circom";

component main {public [path, val]} = IPFS(256, 5, 5);