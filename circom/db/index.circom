pragma circom 2.1.5;
include "./db.circom";

component main {public [col_key, key, path, val, col_root]} = DB(8, 32, 256, 5, 5);