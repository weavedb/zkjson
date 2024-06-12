const { resolve } = require("path");
const MongoClient = require('mongodb').MongoClient;
const {
  path,
  val,
  toSignal,
  fromSignal,
  pad,
  encode,
  decode,
  encodePath,
  decodePath,
  encodeVal,
  decodeVal,
  encodeQuery,
  decodeQuery,
  DB,
} = require("../sdk");
const {
  insert,
  slice,
  unshift,
  shift,
  toArray,
  pop,
  length,
  push,
  next,
  arr,
  last,
  replace,
  get,
  pushArray,
  arrPush,
  arrGet,
  popArray,
  remove,
  bn,
  digits,
} = require("../sdk/uint");
const { parse } = require("../sdk/parse");
const { expect } = require("chai");
const { groth16 } = require("snarkjs");

require('dotenv').config({ path: resolve(__dirname, '../.env') });

// Define a constant with the JSON information
const jsonInfo = { gamer: "Jack", strikes: 300, place: "BS", weapon: "AK47", place2: "A"};

describe("zkDB-zkJSON", function () {
  this.timeout(0);
  it.only("should generate and verify proofs", async () => {
    const url = process.env.MONGO_URL;
    const dbName = process.env.MONGO_DB;
    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);

    const wasm = resolve(
      __dirname,
      "../circom/build/circuits/db/index_js/index.wasm"
    );
    const zkey = resolve(
      __dirname,
      "../circom/build/circuits/db/index_0001.zkey"
    );
    const vkey = resolve(
      __dirname,
      "../circom/build/circuits/db/verification_key.json"
    );

    const zkdb = new DB({ wasm, zkey });
    await zkdb.init();
    await zkdb.addCollection();
    await zkdb.insert(0, "Jack", jsonInfo);

    const { proof, publicSignals } = await zkdb.genProof({
      json: jsonInfo,
      col_id: 0,
      path: "gamer",
      id: "Jack",
    });

    // Combine jsonInfo with zkp to create finalJson
    const finalJson = { ...jsonInfo, zkProof: proof };

    const collection1 = db.collection('counterstrike');
    await collection1.insertOne(finalJson);
  });
});