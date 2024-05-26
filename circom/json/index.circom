pragma circom 2.1.5;
include "./json.circom";

component main {public [path, val]} = JSON(256, 4, 8);
