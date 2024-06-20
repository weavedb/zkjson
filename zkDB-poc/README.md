# zkDB Proof of Concept (zkDB-poc)

## Description
The zkDB Proof of Concept (zkDB-poc) demonstrates a privacy-preserving database system using zk-SNARKs for verifiable proof generation and validation. This system integrates MongoDB for data storage and utilizes cryptographic techniques to ensure data integrity and confidentiality. It also supports on-chain and off-chain proof verification.

## How to Run

### Generate Powers of Tau

1. Go to the root directory:

```bash
cd ..
```

2. Generate the Powers of Tau for the db circuit:

```bash
yarn ceremony --power 16
```

3. For the `rollup` circuit, run:

```bash
yarn ceremony --power 20
```

### Compile Circuits

Compile the necessary circuits for the database and rollup operations:

1. Compile the db circuit:

```bash
yarn compile --power 16 --circuit db
```

2. Compile the rollup circuit:

```bash
yarn compile --power 20 --circuit rollup
```

### Run zkDB Script

1. Install zkDB Dependencies:

```bash
cd zkDB-poc
npm install
```

2. Run the Script

To initialize the zkDB and run the main script:

```bash
npx hardhat run scripts/zkdb-script-ct.js
```

> **Note:**
> When executing the script and choosing to write new data, you can use the following example input:
> ```json
> { "gamer": "Thomas", "strikes": 793287, "place": "SP", "weapon": "AK-47", "place2": "Y"}
> ```

The script provides functionalities to insert data into the database, generate zk-SNARK proofs, and verify these proofs both on-chain and off-chain. Users can choose to write new data or query existing data, ensuring data integrity with cryptographic proofs.