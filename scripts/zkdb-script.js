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
} = require("../../sdk");
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
} = require("../../sdk/uint");
const { parse } = require("../../sdk/parse");
const { expect } = require("chai");
const { groth16 } = require("snarkjs");
const fs = require('fs');
const snarkjs = require("snarkjs");
const crypto = require('crypto');

require('dotenv').config({ path: resolve(__dirname, '../../.env') });

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Dynamically import inquirer and chalk
  const { default: inquirer } = await import('inquirer');
  const { default: chalk } = await import('chalk');

  // Connect to the MongoDB server
  const url = process.env.MONGO_URL;
  const dbName = process.env.MONGO_DB;
 
  // Create a new MongoClient
  const client = new MongoClient(url);
  await client.connect();

  console.log("Connected successfully to server");

  // Connect to the database
  const db = client.db(dbName);

  function createFingerprint(json) {
    const jsonString = JSON.stringify(json);
    const hash = crypto.createHash('sha256');
    hash.update(jsonString);
    const fingerprint = hash.digest('hex');
    return fingerprint;
  }

  const operationAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'operation',
      message: 'Which operation would you like to perform?',
      choices: ['write', 'query']
    }
  ]);

  if (operationAnswer.operation === 'write') {
    const jsonAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'jsonInput',
        message: 'Which record would you like to save (in json format)?'
      }
    ]);

    let jsonInfo;
    try {
      jsonInfo = JSON.parse(jsonAnswer.jsonInput);
    } catch (e) {
      console.log("Invalid JSON format. Please try again.");
      process.exit(1);
    }

    // Create a fingerprint for the JSON information
    const fingerprint = createFingerprint(jsonInfo);

    // Combine the JSON information with the fingerprint
    const json = { ...jsonInfo, fingerprint: fingerprint };

    console.log(chalk.green.bold(`✔ Json info and generated fingerprint`));
    console.log(json);

    // Define the paths to the wasm, zkey, and verification key files
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

    // Create a new instance of the DB class (ZKDB)
    const zkdb = new DB({ wasm, zkey });

    // Initialize the zkdb database
    await zkdb.init();
    await zkdb.addCollection();
    await zkdb.insert(0, "Jack", json);

    // Generate the proof
    const { proof, publicSignals } = await zkdb.genSignalProof({
      json: json,
      col_id: 0,
      path: "gamer",
      id: "Jack",
    });

    console.log(chalk.green.bold(`✔ Proof generated successfully`));
    await delay(1000); // Wait for 1 seconds

    // Load the verification key from a file
    const vKey = JSON.parse(fs.readFileSync(vkey));

    // Verify the proof
    const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (isValid) {
      console.log(chalk.green.bold(`✔ Proof verified successfully`));
    } else {
      console.log("Proof verification failed.");
      process.exit(1);
    }

    // Combine json with zkp to create finalJson
    const finalJson = { ...json, zkProof: proof };

    // Insert finalJson into the database
    const collection1 = db.collection('counterstrike');
    await collection1.insertOne(finalJson);

    console.log("Storing in storage layer...");

    console.log("Final JSON with proof included:", finalJson);

    console.log(chalk.green.bold(`✔ Process completed and JSON saved in Storage layer`));

    process.exit(0);
  } else if (operationAnswer.operation === 'query') {
    // Query operation implementation here
    console.log("Query operation not implemented yet.");
    process.exit(0);
  } else {
    console.log("Invalid operation. Please try again.");
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
