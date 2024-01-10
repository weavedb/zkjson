pragma circom 2.1.5;
include "./db.circom";

component main {public [col_key, key, path, val, col_root]} = DB(30, 1000, 100);