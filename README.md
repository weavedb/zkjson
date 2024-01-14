## Zero Knowledge Provable JSON


```
     _        _  _____  ____  _   _ 
    | |      | |/ ____|/ __ \| \ | |
 ___| | __   | | (___ | |  | |  \| |
|_  / |/ /   | |\___ \| |  | | . ` |
 / /|   < |__| |____) | |__| | |\  |
/___|_|\_\____/|_____/ \____/|_| \_|
```

**zkJSON** makes any arbitrary JSON data provable with zero knoledge proof, and makes them verifiable both offchain and onchain (blockchain).

EVM blockchains like Ethereum will get a hyper scalable NoSQL database extension whereby off-chain JSON data are directly queriable from within Solidity smart contracts.

### Why

Most offchain data on the web are represented in JSON format, and blockchains have been failing to connect with them efficiently for some cricical reasosns.

- Blockchains are not scalable to the web level
- There is no decentralized general-purpose database alternative to cloud databases
- The current decentralized database solutions are too domain specific
- The current oracle / indexer solutions are limited to a great extent

As a result, data on web2 (offchain) and web3 (onhain) are divided and web3 is missing a great wide variety of usecases with offchain data. What if we could verify any offchain JSON data in onchain smart contracts, and also build a general-purpose database with web2-like performance and scalability? zkJSON and zkDB will allow direct connections from smartcontract to offchain database. And we will further make it practical and sustainable with a blockchain rollup and a decentralized network.

### How

There are 4 steps to build a complete solution.

1. make any JSON provable with zk circuits - **zkJSON**
2. build a database structure with merkle trees and zkJSON - **zkDB**
3. commit db states to an EVM blockchain - **zkRollup**
4. make it queriable with Solidity - **zkQuery**

And 3 bonus steps to make it practical and sustainable (using Arweave & Cosmos IBC).

5. make zkDB feature-rich to bear any web2/web3 usages - **WeaveDB**
6. make WeaveDB performant, scalable, and secure with Arweave+EVM hybrid rollup - **WeaveDB Rollup**
7. make the rollups sustainable with DePIN - **WeaveChain**

*This repo contains only the first 4 steps.*

#### zkJSON

The key to making JSON verifiable with zkp is to invent a deterministic encoding which is friendly to zk circuits. zk circuits can only handle arithmetic operations with natural numbers, so we need to convert any JSON to a series of natural numbers back and forth. Just to clarify, you cannot simply convert it to a binary format or any existing encoding formats, because it has to specifically make sense to the circuit logic.

##### Encoding

zk circuits cannot handle arbitrarily nesting dynamic arrays. So we first need to flatten all the paths.

```
{ "a" : 1, "c" : false, "b" : { "e" : null, "d" : "four" }, "f" : 3.14, "ghi" : [ 5, 6, 7 ] }
```

becomes

```
[
  [ "a", 1 ],
  [ "c", false ]
  [ "b.e", null ],
  [ "b.d", "four" ],
  [ "f", 3.14 ],
  [ "ghi, [ 5, 6, 7 ] ],
]
```
Each path will be converted to an unicode number.

```
[
  [ [ [ 97 ] ], 1 ],
  [ [ [ 99 ] ], false ]
  [ [ [ 98 ], [ 101 ] ], null ],
  [ [ [ 98 ], [ 100 ] ], "four" ],
  [ [ [ 102 ] ], 3.14 ],
  [ [ [ 103, 104, 105 ] ], [ 5, 6, 7 ] ]
]
```

To make it deterministic, items must be lexicographically sorted by the paths.

```
[
  [ [ [ 97 ] ], 1 ],
  [ [ [ 98 ], [ 100 ] ], "four" ],
  [ [ [ 98 ], [ 101 ] ], null ],
  [ [ [ 99 ] ], false ]
  [ [ [ 102 ] ], 3.14 ],
  [ [ [ 103, 104, 105 ] ], [ 5, 6, 7 ] ]
]
```

Here's a tricy part, if the value is an array, we need to create a path for each element, but we need to tell the difference between `ghi.0` and `ghi[0]` with just numbers. `ghi.0` is a path to an object, `ghi[0]` is a path to an array element. Also there is a case where the key is empty like `{ "" : "empty" }`, and also just a primitive value without the top level element being an object is also a valid JSON, such as `null`, `true`, `[ 1, 2, 3]`, `1`. You can express the paths with empty string ` `, or something like `a..b` for `{ "a" : { "" : { "b" : 1 } } }`.

To address all these edge cases, we prefix each array key with the number of characters, or `0` if the key is empty (followed by `1`) or an array index (followed by another`0`).

```
[
  [ [ [ 1, 97 ] ], 1 ],
  [ [ [ 1, 98 ], [ 1, 100 ] ], "four" ],
  [ [ [ 1, 98 ], [ 1, 101 ] ], null ],
  [ [ [ 1, 99 ] ], false ]
  [ [ [ 1, 102 ] ], 3.14 ],
  [ [ [ 3, 103, 104, 105 ], [ 0, 0, 0 ] ], 5 ],
  [ [ [ 3, 103, 104, 105 ] ], [ 0, 0, 1 ], 6 ],
  [ [ [ 3, 103, 104, 105 ] ], [ 0, 0, 2 ], 7 ]
]
```

Now we flatten the paths, but also prefix them with how many nested keys each path contains.

```
[
  [ 1, 1, 97 ], 1 ],
  [ 2, 1, 98 , 1, 100 ], "four" ],
  [ 2,  1, 987, 1, 101 ], null ],
  [ 1, 1, 99 ], false ]
  [ 1, 1, 102 ], 3.14 ],
  [ 2, 3, 103, 104, 105, 0, 0, 0 ], 5 ],
  [ 2, 3, 103, 104, 105, 0, 0, 1 ], 6 ],
  [ 2, 3, 103, 104, 105, 0, 0, 2 ], 7 ]
]
```
If the top level is non-object value such as `1` and `null`, the flattened path is always `[ 1, 0, 1 ]`.

Let's numerify the values in a similar fashion. There are only 6 valid data types in JSON ( `null` / `boolean` / `number` / `string` / `array` / `object` ), and since the paths are flattened, we need to handle only 4 primitive types. We assign a type number to each.

- null (`0`)
- boolean (`1`)
- number (`2`)
- string (`3`)

The first digit will always be the type number.

###### null (0)

`null` is always `[ 0 ]` as there's nothing else to tell.

###### boolean (1)

There are only 2 cases. `true` is `[ 1, 1 ]` and `false` is `[ 1, 0 ]`.

###### number (2)

`number` is a bit tricky as we need to differenciate integers and floats, and also positive numbers and negative ones. Remember that circuits can only handle natural numbers. A number contains 4 elements.

- 1st element - type `2`
- 2nd - sign, `0` for negative, `1` for positive
- 3rd - how many digits after `.`, `0` in case of an integer
- 4th - actual number without `.`

for instance,

- `1` : `[ 2, 1, 0, 1 ]`
- `-1` : `[ 2, 0, 0, 1 ]`
- `3.14` : `[ 2, 1, 2, 314 ]`

###### string (3)

The first digit is the type `3` and the second digit tells how many characters, then each characters are converted to a unicode number (e.g. `abc` = `[ 3, 3, 97, 98, 99 ]`).


Now let's convert the values in our original JSON example.

```
[
  [ 1, 1, 97 ], [ 2, 1, 0, 1 ] ],
  [ 2, 1, 98 , 1, 100 ], [ 3, 4, 102, 111, 117, 114 ] ],
  [ 2,  1, 987, 1, 101 ], [ 0 ] ],
  [ 1, 1, 99 ], [ 1, 0 ] ]
  [ 1, 1, 102 ], [ 2, 1, 2, 314 ] ],
  [ 2, 3, 103, 104, 105, 0, 0, 0 ], [ 2, 1, 0, 5 ] ],
  [ 2, 3, 103, 104, 105, 0, 0, 1 ], [ 2, 1, 0, 6 ] ],
  [ 2, 3, 103, 104, 105, 0, 0, 2 ], [ 2, 1, 0, 7 ] ]
]
```
Now we are to flatten the entire nested arrays, but each number must be prefixed by the number of digits that contains, otherwise there's no way to tell where to partition the series of digits. And here's another tricy part, if the number contains more than 9 digits, you cannot prefix it with 10, 11, 12 ... because when all the numbers are concatenated later, `10` doesn't mean that `10` digits follow, but it means `1` digit follows and it's `0`. So we allow max 8 digits in each partition and `9` means there will be another partition(s) following the current one.

- `123` : `[ 3, 123 ]`
- `12345678` : `[ 8, 12345678 ]`
- `1234567890` : `[ 9, 12345678, 2, 90 ]`

By the way, digits are in fact stored as strings, so a leading 0 won't disapper.

- `1234567809` : `[ "9", "12345678", "2", "09" ]`

This is the prefixed version.

```
[
  [ 1, 1, 1, 1, 2, 97 ], [ 1, 2, 1, 1, 1, 0, 1, 1 ] ],
  [ 1, 2, 1, 1, 2, 98 , 1, 1, 3, 100 ], [ 1, 3, 1, 4, 3, 102, 3, 111, 3, 117, 3, 114 ] ],
  [ 1, 2,  1, 1, 3, 987, 1, 1, 3, 101 ], [ 1, 0 ] ],
  [ 1, 1, 1, 1, 2, 99 ], [ 1, 1, 1, 0 ] ]
  [ 1, 1, 1, 1, 3, 102 ], [ 1, 2, 1, 1, 1, 2, 3, 314 ] ],
  [ 1, 2, 1, 3, 3, 103, 3, 104, 3, 105, 1, 0, 1, 0, 1, 0 ], [ 1, 2, 1, 1, 1, 0, 1, 5 ] ],
  [ 1, 2, 1, 3, 3, 103, 3, 104, 3, 105, 1, 0, 1, 0, 1, 1 ], [ 1, 2, 1, 1, 1, 0, 1, 6 ] ],
  [ 1, 2, 1, 3, 3, 103, 3, 104, 3, 105, 1, 0, 1, 0, 1, 2 ], [ 1, 2, 1, 1, 1, 0, 1, 7 ] ]
]
```

Then this is the final form all flattened.

```
[ 1, 1, 1, 1, 2, 97, 1, 2, 1, 1, 1, 0, 1, 1, 1, 2, 1, 1, 2, 98, 1, 1, 3, 100, 1, 3, 1, 4, 3, 102, 3, 111, 3, 117, 3, 114, 1, 2, 1, 1, 3, 987, 1, 1, 3, 101, 1, 0, 1, 1, 1, 1, 2, 99, 1, 1, 1, 0, 1, 1, 1, 1, 3, 102, 1, 2, 1, 1, 1, 2, 3, 314, 1, 2, 1, 3, 3, 103, 3, 104, 3, 105, 1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 1, 0, 1, 5, 1, 2, 1, 3, 3, 103, 3, 104, 3, 105, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 6, 1, 2, 1, 3, 3, 103, 3, 104, 3, 105, 1, 0, 1, 0, 1, 2, 1, 2, 1, 1, 1, 0, 1, 7 ]
```

When passed to a circuit, all digits will be concatenated into one number. Circom uses modulo with

`21888242871839275222246405745257275088548364400416034343698204186575808495617` (77  digits)

which means up to 76 digits are safe and a 77-digit-number could overflow. So as a circuit signal, it becomes

```
[
  "111129712111011121129811310013143102311131173114121139871131011011112991110",
  "1111310212111233141213310331043105101010121110151213310331043105101011121110",
  "15121331033104310510101112111016121331033104310510101212111017",
  "0",
  "0",
  ...
]
```

Now we can build a circuit to handle these digits and prove the value of a selected path without revealing the entire JSON. It's easy to explain the encoding, but harder to write the actual encoder/decorder and a circuit to properly process this encoding. But fortunately, we already did write them!

#### zkDB

Once we get zkJSON, we can build a database structure with zkJSON as base building blocks.

A document-based NoSQL database would have collections, and each collection in turn would have a bunch of documents, which are JSONs.

##### Collection

We can use a sparse merkle tree (SMT) to represent all the document data in a collection with a root hash. SMT is perfect because curcuits cannot handle dynamic tree sizes and SMT can represent a large number of documents efficiently. Each leaf node will be the poseidon hash of zkJSON encoding of the data. And each leaf node has an index number, so we need to somehow convert the document IDs to numbers without collisions. How many leaf nodes a SMT hss depends on the pre-defined depth of the tree. For example, a 32-level SMT can have `2 ** 32 = 4294967296` leaf nodes. The level must be pre-defined at the circuit compile time, so we need to find the right conversion and balance.

For this constraint, we only allow 64 characters to keep things compact and efficient, although there can be different optimized setups for your specific usecases. 

- `A-Z` (0 - 25)
- `a-z` (26 - 51)
- `0-9` (52 - 61)
- `-` (62)
- `_` (63)

Now 2 digits can represent one character with collision free, which means we can have only up to 4 characters in document IDs with a 32 level SMT. We can of course increase the level to have more characters, but the more levels, the more computation with the circuit, so we need to find the right balance. For instance, to allow 10 characters we need 67 levels of SMT.

##### Database

For the database, we can take the exact same approach with the collections. We can use a SMT to represent multiple collection states in a DB with one root hash, and each leaf node will be the merkle root of a collection, which in turn represents the entire documents in the collection. We will give each collection an ID with the same ID-to-index conversion as the documents.

Now we can write a circuit to proove a collection root hash, then we can write another circuit to prove a database root hash, which represents multiple collections within the database. This circuit can also prove any value in any JSON document in any collection in a database without revealing the entire JSON data. zkJSON enables this.

#### zkRollup

How do we make zkDB secure and queriable from other blockchains? We can write a circuit to prove the merkle tree hash transitions and deploy a Solidity contract to verify that proofs onchain. Fortunately, Circom auto generates a Solidity verifier for us, so we can use that function in our verifier contract. We need to keep track of the current database root merkle hash as a Solidity contract state.

#### zkQuery

Finally, we can deploy the prevous zkDB query circout verifier as a Solidity contract too, and make it possible to securely query any paths with the right proof. When querying, the Solidity contract must check the DB root hash to verify the queried value againts the current database state.

