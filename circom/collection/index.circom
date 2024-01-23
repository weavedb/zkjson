pragma circom 2.1.5;
include "./collection.circom";

 component main {public [key, path, val]} = Collection(100, 256, 5, 5);