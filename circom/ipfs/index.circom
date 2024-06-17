pragma circom 2.1.5;
include "./ipfs.circom";

component main {public [path, val]} = IPFS(256, 4, 8, 10);
