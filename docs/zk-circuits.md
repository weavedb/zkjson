## ZK Circuits

There are 5 main circuits, and each circuit is built on top of the preceding one.

### Circuits

#### JSON.circom

The base building block to prove JSON with an efficient encoding.

- `size_json` : JSON size : default `256`
- `size_path` : path size : default `5`
- `size_val` : value size : default `5`

#### Collection.circom

A collection proven by a sparse merkle tree (SMT) can contain many JSON documents (256 ** 100 by default).

- `level` : collection SMT level : default `100`
- `size_json` : JSON size : default `256`
- `size_path` : path size : default `5`
- `size_val` : value size : default `5`

#### DB.circom

A database proven by a sparse merkle tree (SMT) can contain many collections (2 ** 8 by default).

- `level_col` : DB SMT level : default `8`
- `level` : collection SMT level : default `100`
- `size_json` : JSON size : default `256`
- `size_path` : path size : default `5`
- `size_val` : value size : default `5`

#### Query.circom

Query proves a JSON data insert or update by a single write query.

- `level_col` : DB SMT level : default `8`
- `level` : collection SMT level : default `100`
- `size_json` : JSON size : default `256`

#### Rollup.circom

Rollup proves batch data transitions.

- `tx_size` : max number of queries in a batch : default `10`
- `level_col` : DB SMT level : default `8`
- `level` : collection SMT level : default `100`
- `size_json` : JSON size : default `256`

### Powers of Tau

The first thing you need to do is to set up a powers of tau by a ceremony. As the power goes up the generation time and the wasm file size increases exponentially, and what power required for each circuit depends on the parameters above. So you need to find the right balance with the parameters of each circuit for your application. For instance, `power 20` required for the default `Rollup` circuit settings takes hours with a normal consumer computer.

To run a ceremony,

```bash
yarn ceremony --power 14
```

Generated files are located at `build/pot`.

You can also specify `entropy` and `name` for the ceremony. Refer to [the Circom docs](https://docs.circom.io/getting-started/proving-circuits/) for what they mean.

```bash
yarn ceremony --power 14 --name "first contribution" --entropy "some random value"
```

The same goes with the compiling process below.

### Compile Circuit

You can specify the parameters when compiling a circuit. Unspecified parameters will use the default values.

For instance, to compile the `JSON` circuit,

```bash
yarn compile --power 14 --circuit json --size_json 256 --size_path 5 --size_val 5
```

To compile the `Rollup` circuit,

```bash
yarn compile --power 20 --circuit rollup --tx_size 10 --level_col 8 --level 100 --size_json 256
```

All the generated files are stored at `build/circuits` including a Solidity verifier contract.

### Concept of Some Parameters

[The litepaper](../) explains in detail, but here are brief explanations on `size` and `level`.

#### size

The base unit of `size` is `uint`. Circom by default uses the module of `21888242871839275222246405745257275088548364400416034343698204186575808495617` (77 digits) and Solidity's base storage block is `uint256` and allows 78 digits. So zkJSON efficiently encodes JSON and packs it into blocks of 76 digits, which is one `uint`.

`path_size=5` means, 5 * 76 digits are allowed for the query path when encoded, and it will be represented within `uint[5]` in Solidity. on the Solidity side, however, zkJSON uses dynamic arrays `uint[]`, so it will be more space-efficient than the max set size. But the zk-circuits cannot prove data sizes more than the set size.

The default `json_size` is set `256`, which is 256 * 76 digits and should be sufficient for most JSON data.

#### level

`level` is the level of the sparse merkle tree (SMT). As the litepaper describes, the level of SMT for Collection determines how many alphanumeric characters each document ID can contain. It's determined by

```math
Number of Characters = \frac{\log_{10}(2^{\text{Level}})}{2}
```

`level=100` can allow 15 characters in document ID. This is significant because document IDs are often used in access control rules of NoSQL databases (with WeaveDB, for instance).

For DB, `level_col` determines how many collections the DB can contain. The collection IDs use the direct index numbers and are not converted to an alphanumeric representation, so `level_col=8` (2 ** 8 = 256) collections should be sufficient for most applications. But you are free to set a different value.

### Default Parameters and Required POT

| Circuit | POT | size_json | size_path | size_val | level | level_col | tx_size |
|---|---|---|---|---|---|---|---|
| **JSON** | 14 | 256 | 5 | 5 |   |   |   |
| **Collection** | 16 | 256 | 5 | 5 | 100 |   |   |
| **DB** | 16 | 256 | 5 | 5 | 100 | 8 |   |
| **Query** | 17 | 256 |  |   | 100 | 8 |   |
| **Rollup** | 20 | 256 |  |   | 100 | 8 | 10 |

**Currently the SDK only works with `size_json=256` due to some hash logic. Keep it 256 for now please.**
