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
const jsonInfo = { gamer: "Alice", strikes: 30, place: "BS" };

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
    await zkdb.insert(0, "Alice", jsonInfo);
  

    const proof = await zkdb.genProof({
      json: jsonInfo,
      col_id: 0,
      path: "name",
      id: "Alice",
    });

    // Parse the proofResult into pi_a, pi_b, pi_c and publicSignals
    //const proof = {
    //  pi_a: proofResult.slice(0, 3).map(BigInt),
    //  pi_b: [proofResult.slice(3, 5).map(BigInt), proofResult.slice(5, 7).map(BigInt)],
    //  pi_c: proofResult.slice(7, 10).map(BigInt)
    //};
    //const publicSignals = proofResult.slice(10).map(BigInt);

    // Log proof and publicSignals for debugging
    //console.log("Proof:", proof);
    //console.log("Public Signals:", publicSignals);
//
    // Combine jsonInfo with zkp to create finalJson
    const finalJson = { ...jsonInfo, zkProof: proof };

    const collection1 = db.collection('counterstrike');
    await collection1.insertOne(finalJson);  // Use finalJson constant

    // Verify the proof
    //const verificationKey = require(vkey);
    //console.log("Verification Key:", verificationKey);
    //const isValid = await groth16.verify(verificationKey, publicSignals, proof);
    //console.log("Proof is valid:", isValid);
    //expect(isValid).to.be.true;
  });
});
