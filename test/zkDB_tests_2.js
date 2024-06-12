/* const { resolve } = require("path");
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
  toIndex, // Import the new function
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
const { id } = require("ethers/lib/utils");

require('dotenv').config({ path: resolve(__dirname, '../.env') });

// Define a constant with the JSON information
const jsonInfo = { gamer: "Bob", strikes: 78, place: "SP", weapon: "AK47", place2: "A" };

describe("zkDB-zkJSON", function () {
  this.timeout(0);

  let client;

  before(async () => {
    const url = process.env.MONGO_URL;
    client = new MongoClient(url);
    await client.connect();
    console.log("Connected successfully to server");
  });

  after(async () => {
    if (client) {
      await client.close();
      console.log("MongoDB connection closed");
    }
  });

  it.only("should record in MongoDB", async () => {
    const dbName = process.env.MONGO_DB;
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

    //const zkdb = new DB({ wasm, zkey });
    //await zkdb.init();
    //await zkdb.addCollection();
    //await zkdb.insert(0, "Bob", jsonInfo);

    const _json = jsonInfo
    const _path = "gamer"
    const _val = _json[_path]
   

    const gen = async ({
      size_val = 8,
      size_path = 4,
      size_json = 256,
      level = 168,
      level_col = 8,
    }) => {
      const db = new DB({ size_val, size_path, size_json, level, level_col })
      await db.init()
      await db.addCollection()
      const col_id = await db.addCollection()
      
      const inputs = await db.getInputs({
        col_id: col_id,
        id: "gamer",
        json: _json,
        path: _path,
        val: _val,
      });
      if (!inputs) {
        console.error('Inputs is undefined')
        throw new Error('Inputs is undefined')
      }
      return {
        inputs
      }
    }

    // Before generating the proof, ensure the collection exists
    const proofGenerator = async () => {    
      const { inputs } = await gen({
        size_val: 8,
        size_path: 4,
        size_json: 256,
        level: 168,
        level_col: 8,
      });
      const { proof, publicSignals } = await groth16.fullProve(
        inputs,
        wasm,
        zkey
      );
      const zkp2 = await db.genProof({ json: jsonInfo, col_id, path: _path, id: "gamer" })
      return { proof, publicSignals };
    };

    const { proof, publicSignals } = await proofGenerator();

    // Combine jsonInfo with zkp to create finalJson
    const finalJson = { ...jsonInfo, zkProof: proof };

    const collection1 = db.collection('counterstrike');
    await collection1.insertOne(finalJson);

    // Verify the proof
    const verificationKey = require(vkey);
    console.log("Verification Key:", verificationKey);
    const isValid = await groth16.verify(verificationKey, publicSignals, proof);
    console.log("Proof is valid:", isValid);
    expect(isValid).to.be.true;
  });
}); */