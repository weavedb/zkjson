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

describe("zkDB-zkJSON", function () {
  this.timeout(0);
  it.only("should generate proofs", async () => {
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

    const jsonInfo = { gamer: "John", strikes: 40, place: "NY" };

    const zkdb = new DB({ wasm, zkey });
    await zkdb.init();
    await zkdb.addCollection();
    await zkdb.insert(0, jsonInfo.gamer, jsonInfo);
    const zkp = await zkdb.genProof({
      json: jsonInfo,
      col_id: 0,
      path: "name",
      id: jsonInfo.gamer,
    });

    const finalJson = { ...jsonInfo, zkProof: zkp };

    const collection1 = db.collection('counterstrike');
    await collection1.insertOne(finalJson);

    //const collection2 = db.collection('collection2');
    //await collection2.insertOne({ name: "Alice" });
    //const zkp2 = await zkdb.genProof({
    //  json: { name: "Alice" },
    //  col_id: 1,
    //  path: "name",
    //  id: "Alice",
    //})

    //console.log("zkp1", zkp)
    //console.log("zkp2", zkp2)
  });
});
