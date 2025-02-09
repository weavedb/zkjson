# zkJSON v2

zkJSON v2 drastically improves space efficiency with new value type definitions and prepended dictionary to remove path redundancy.

## Encoding

### Paths

zk circuits can neither handle objects nor dynamically nested arrays. So we first need to flatten all the paths into a simple array.

```js
{
  "a": 1,
  "c": false,
  "b": { "e": null, "d": "four" },
  "f": 3.14,
  "ghi": [ 5, 6, 7 ],
}
```

becomes

```js
[
  [ [ "a" ], 1 ],
  [ [ "c" ], false ]
  [ [ "b", "e" ], null ],
  [ [ "b", "d" ], "four" ],
  [ [ "f" ], 3.14 ],
  [ [ "ghi", 0 ], 5 ],
  [ [ "ghi", 1 ], 6 ],
  [ [ "ghi", 2 ], 7 ],
]
```

Each path will be converted to an unicode number.

```js
[
  [ [ [ 97 ] ], 1 ],
  [ [ [ 99 ] ], false ]
  [ [ [ 98 ], [ 101 ] ], null ],
  [ [ [ 98 ], [ 100 ] ], "four" ],
  [ [ [ 102 ] ], 3.14 ],
  [ [ [ 103, 104, 105 ], 0 ], 5 ],
  [ [ [ 103, 104, 105 ], 1 ], 6 ],
  [ [ [ 103, 104, 105 ], 2 ], 7 ],
]
```

To make it deterministic, items must be lexicographically sorted by the paths.

```js
[
  [ [ [ 97 ] ], 1 ],
  [ [ [ 98 ], [ 100 ] ], "four" ],
  [ [ [ 98 ], [ 101 ] ], null ],
  [ [ [ 99 ] ], false ],
  [ [ [ 102 ] ], 3.14 ],
  [ [ [ 103, 104, 105 ], 0 ], 5 ],
  [ [ [ 103, 104, 105 ], 1 ], 6 ],
  [ [ [ 103, 104, 105 ], 2 ], 7 ],
]
```

Here's a tricky part, if the value is an array, we need to create a path for each element, but we need to tell the difference between `ghi.0` and `ghi[0]` with just numbers. `ghi.0` is a path to an object, `ghi[0]` is a path to an array element. Also there is a case where the key is empty like `{ "" : "empty" }`. Another case to note is that just a primitive value without the top level element being an object is also a valid JSON, such as `null`, `true`, `[ 1, 2, 3]`, `1`. You can express the paths with empty string ` `, or something like `a..b` for `{ "a" : { "" : { "b" : 1 } } }`.

To address all these edge cases, we prefix each array key with the number of characters that follow, or `0` if the key is empty (followed by `1`) or an array index (followed by another`0`).

```js
[
  [ [  1, 97 ] ], 1 ],
  [ [ [ 1, 98 ], [ 1, 100 ] ], "four" ],
  [ [ [ 1, 98 ], [ 1, 101 ] ], null ],
  [ [ [ 1, 99 ] ], false ],
  [ [ [ 1, 102 ] ], 3.14 ],
  [ [ [ 3, 103, 104, 105 ], [ 0, 0, 0 ] ], 5 ],
  [ [ [ 3, 103, 104, 105 ], [ 0, 0, 1 ] ], 6 ],
  [ [ [ 3, 103, 104, 105 ], [ 0, 0, 2 ] ], 7 ],
]
```

Now we flatten the paths but also prefix them with how many nested keys each path contains.

```js
[
  [ [ 1, 1, 97 ], 1 ],
  [ [ 2, 1, 98 , 1, 100 ], "four" ],
  [ [ 2, 1, 98 , 1, 101 ], null ],
  [ [ 1, 1, 99 ], false ],
  [ [ 1, 1, 102 ], 3.14 ],
  [ [ 2, 3, 103, 104, 105, 0, 0, 0 ], 5 ],
  [ [ 2, 3, 103, 104, 105, 0, 0, 1 ], 6 ],
  [ [ 2, 3, 103, 104, 105, 0, 0, 2 ] ], 7 ],
]
```

If the top level is a non-object value such as `1` and `null`, the flattened path is always `[ 0 ]`.


### Dictionary

Here is the biggest improvement from v1. We create a dictionary for redundant paths.

```js
[ "b" , "ghi" ]
```

And replace the redundant paths with dictionary indexes.

```js
[
  [ [ "a" ], 1 ],
  [ [ [ 0 ], "d" ], "four" ],
  [ [ [ 0 ], "e" ], null ],
  [ [ "c" ], false ],
  [ [ "f" ], 3.14 ],
  [ [ [ 1 ], 0 ], 5 ],
  [ [ [ 1 ], 1 ], 6 ],
  [ [ [ 1 ], 2 ], 7 ],
]
```

Dictionary references are prefixed with `[ 0, 3 ]` for a single reference, `[ 0, 4 ]` for multiple references.

```js
[
  [ [  1, 97 ] ], 1 ],
  [ [ [ 0, 3, 0 ], [ 1, 100 ] ], "four" ],
  [ [ [ 0, 3, 0 ], [ 1, 101 ] ], null ],
  [ [ [ 1, 99 ] ], false ],
  [ [ [ 1, 102 ] ], 3.14 ],
  [ [ [ 0, 3, 1 ], [ 0, 0, 0 ] ], 5 ],
  [ [ [ 0, 3, 1 ], [ 0, 0, 1 ] ], 6 ],
  [ [ [ 0, 3, 1 ], [ 0, 0, 2 ] ], 7 ],
]
```
Now flattened paths will become,

```js
[
  [ [ 1, 1, 97 ], 1 ],
  [ [ 2, 0, 3, 0 , 1, 100 ], "four" ],
  [ [ 2, 0, 3, 0 , 1, 101 ], null ],
  [ [ 1, 1, 99 ], false ],
  [ [ 1, 1, 102 ], 3.14 ],
  [ [ 2, 0, 3, 1, 0, 0, 0 ], 5 ],
  [ [ 2, 0, 3, 1, 0, 0, 1 ], 6 ],
  [ [ 2, 0, 3, 1, 0, 0, 2 ] ], 7 ],
]
```

And dictionary itself will be encoded.

```js
[ [ 1, 98 ], [ 3, 103, 104, 105] ] ]
```

Each entry will be prefix by the value type and number of keys in the set. 

```js
[ [ 1, [ 7, 1, 98 ] ], [ 1, [ 7, 3, 103, 104, 105 ] ] ] ]
```
The entire dictionary will be flattened and prefixed by `[1, 0, 2, number_of_entries ]`, and prepended to the rest of the encoding.

```js
[
  [ 1, 0, 2, 2, 1, 7, 1, 98, 1, 7, 3, 103, 104, 105 ],
  [ [ 1, 1, 97 ], 1 ],
  [ [ 2, 0, 3, 0 , 1, 100 ], "four" ],
  [ [ 2, 0, 3, 0 , 1, 101 ], null ],
  [ [ 1, 1, 99 ], false ],
  [ [ 1, 1, 102 ], 3.14 ],
  [ [ 2, 0, 3, 1, 0, 0, 0 ], 5 ],
  [ [ 2, 0, 3, 1, 0, 0, 1 ], 6 ],
  [ [ 2, 0, 3, 1, 0, 0, 2 ] ], 7 ],
]
```

Dictionary reduces the number of digits in the encoded data, which matters a lot when dealing with zk circuit signals (explained later). We don't consider uint8 (256bits) optimizations for byte sizes, but we count the digits to optimize for zk circuits. So `[ 3, 103, 104, 105 ]` counts as `10`, not `4`. 

[MessagePack](https://msgpack.org/) does a great job optimizing for small byte sizes. But it's too complex and computationally heavy to process with zk circuits due to its dynamically nested nature to save spaces. zk curtuits cannot handle dynamic variables very well. Circuits handle pre-determined fixed size signals and variables.

For example, 3 of `[ 3, 103, 104, 105 ]` were replaced with `[ 0, 3, 1 ]` and `[ 1, 7, 3, 103, 104, 105 ]`, which reduced the digits from `30` to `21`. The saving becomes bigger with deeply nested arrays and objects.

There are only 3 types used in a dictionary. A more comprehensive example is the following.

- `3` : positibe integer
- `7` : string
- `9` : reference to another entry

```js
[ "abc" , [ "abc", 1, "def" ], [ "abc", 1, "def", "ghi", "abc" ] ]
```

will be represented as,

```js
[ 
  [ 1, [ 7, 97, 98, 99 ] ], 
  [ 3, [ 9, 0 ], [ 3, 1 ], [ 7, 100, 101, 102 ] ], 
  [ 3, [ 9, 1 ], [ 7, 103, 104, 105 ], [ 9, 0 ] ] 
]
```

and the rest is the same.

### Values

Let's numerify the values in a similar fashion. There are only 6 valid data types in JSON ( `null` / `boolean` / `number` / `string` / `array` / `object` ), and since the paths are flattened, we need to handle only 4 primitive types. We assign a type number to each.

- null (`0`)
- boolean | true (`1`)
- boolean | false (`2`)
- number | positive integer (`3`)
- number | negative integer (`4`)
- number | positive float (`5`)
- number | negative float (`6`)
- string (`7`)
- array & object (`8`)
- dictionary reference (`9`)

The first digit will always be the type number.

###### null (0)

`null` is always `[ 0 ]` as there's nothing else to tell.

###### boolean (1|2)

There are only 2 cases. `true` is `[ 1 ]` and `false` is `[ 2 ]`.

###### number (3|4|5|6)

`number` is a bit tricky as we need to differentiate integers and floats, and also positive numbers and negative ones. Remember that circuits can only handle natural numbers. A number contains 4 elements.

- 1st element  
  - `3` : positive integer
  - `4` : negative integer
  - `5` : positive float
  - `6` : negative float
- 2nd - how many digits after `.`, omitted in case of an integer
- 3rd (or 2nd) - actual number without `.`

for instance,

- `1` : `[ 3, 1 ]`
- `-1` : `[ 4, 1 ]`
- `3.14` : `[ 5, 2, 314 ]`
- `-3.14` : `[ 6, 2, 314 ]`

###### string (7)

The first digit is the type `7` and the second digit tells how many characters, then each character is converted to a unicode number (e.g. `abc` = `[ 7, 3, 97, 98, 99 ]`).

###### array | object (8)

In the case of an array and object, it prefixes `8` and recursively encodes all the nested values. The final array includes internal paths too.

- `[ 1, 2 ]` : `[ 8, 1, 0, 0, 0, 2, 1, 0, 1, 1, 0, 0, 1, 2, 1, 0, 2 ]`

Note that the path to `1` is `1, 0, 0, 0` and the path to `2` is `1, 0, 0, 1`, and they are included.

Now let's convert the values in our original JSON example.

```js
[
  [ 1, 0, 2, 2, 1, 7, 1, 98, 1, 7, 3, 103, 104, 105 ],
  [ [ 1, 1, 97 ], [ 3, 1 ] ],
  [ [ 2, 0, 3, 0, 1, 100 ], [ 7, 4, 102, 111, 117, 114 ] ],
  [ [ 2, 0, 3, 0, 1, 101 ], [ 0 ] ],
  [ [ 1, 1, 99 ], [ 2 ] ],
  [ [ 1, 1, 102 ], [ 5, 314 ] ],
  [ [ 2, 0, 3, 1, 0 ], [ 3, 5 ] ],
  [ [ 2, 0, 3, 1, 1 ], [ 3, 6 ] ],
  [ [ 2, 0, 3, 1, 2 ], [ 3, 7 ] ],
]
```

### Flattening

Now we are to flatten the entire nested arrays, but each number must be prefixed by the number of digits that contains, otherwise, there's no way to tell where to partition the series of digits. And here's another tricky part, if the number contains more than 9 digits, you cannot prefix it with 10, 11, 12 ... because when all the numbers are concatenated later, `10` doesn't mean that `10` digits follow, but it means `1` digit follows and it's `0`. So we allow max 8 digits in each partition and `9` means there will be another partition(s) following the current one.

- `123` : `[ 3, 123 ]`
- `12345678` : `[ 8, 12345678 ]`
- `1234567890` : `[ 9, 12345678, 2, 90 ]`

By the way, digits are in fact stored as strings, so a leading 0 won't disappear.

- `1234567809` : `[ "9", "12345678", "2", "09" ]`


This is the prefixed version.

```js
[
  [ 1, 1, 1, 0, 1, 2, 1, 2, 1, 1, 1, 7, 1, 1, 2, 98, 1, 1, 1, 7, 1, 3, 3, 103, 3, 104, 3, 105 ],
  [ [ 1, 1, 1, 1, 2, 97 ], [ 1, 3, 1, 1 ] ],
  [ [ 1, 2, 1, 0, 1, 3, 1, 0, 1, 1, 3, 100 ], [ 1, 7, 1, 4, 3, 102, 3, 111, 3, 117, 3, 114 ] ],
  [ [ 1, 2, 1, 0, 1, 3, 1, 0, 1, 1, 3, 101 ], [ 1, 0 ] ],
  [ [ 1, 1, 1, 1, 2, 99 ], [ 2, 2 ] ],
  [ [ 1, 1, 1, 1, 3, 102 ], [ 1, 5, 3, 314 ] ],
  [ [ 1, 2, 1, 0, 1, 3, 1, 1, 1, 0 ], [ 1, 3, 1, 5 ] ],
  [ [ 1, 2, 1, 0, 1, 3, 1, 1, 1, 1 ], [ 1, 3, 1, 6 ] ],
  [ [ 1, 2, 1, 0, 1, 3, 1, 1, 1, 2 ], [ 1, 3, 1, 7 ] ],
]
```

Then this is the final form all flattened.

```js
[ 1, 1, 1, 0, 1, 2, 1, 2, 1, 1, 1, 7, 1, 1, 2, 98, 1, 1, 1, 7, 1, 3, 3, 103, 3, 104, 3, 105, 1, 1, 1, 1, 2, 97, 1, 3, 1, 1, 1, 2, 1, 0, 1, 3, 1, 0, 1, 1, 3, 100, 1, 7, 1, 4, 3, 102, 3, 111, 3, 117, 3, 114, 1, 2, 1, 0, 1, 3, 1, 0, 1, 1, 3, 101, 1, 0, 1, 1, 1, 1, 2, 99, 2, 2, 1, 1, 1, 1, 3, 102, 1, 5, 3, 314, 1, 2, 1, 0, 1, 3, 1, 1, 1, 0, 1, 3, 1, 5, 1, 2, 1, 0, 1, 3, 1, 1, 1, 1, 1, 3, 1, 6, 1, 2, 1, 0, 1, 3, 1, 1, 1, 2, 1, 3, 1, 7 ]
```

### ZK Circuit Signals

It's 144 integers, or 182 digits. The original JSON was 66 character long when JSON.stringified, so it's not too bad considering integer vs character (let's say one ascii char takes up 3 digits and one unicode char takes up 7 digits). And zk circuits and Solidity cannot handle just stringified JSONs anyway. But it gets better.

When passed to a circuit, all digits will be concatenated into one integer. [Circom](https://docs.circom.io/circom-language/basic-operators/) by default uses a modulo with

`21888242871839275222246405745257275088548364400416034343698204186575808495617` (77  digits)

which means up to 76 digits are safe and a 77-digit number could overflow, which is also within the range of `uint / uint256` in Solidity.

So to convert the encoded array to a circuit signal, it becomes

```js
[ 
  111012121117112981117133103310431051111297131112101310113100171431023111311,
  731141210131011310110111129922111131021533141210131110131512101311111316121,
  01311121317
]
```

If you observe carefully, there's room for more compression. Most digits are a single digit with a prefix of `1`, so we can remove the prefixes and join the succession of single digits, and we can use `0` and the number of single digits in the succession. For instance `121110111211` becomes `06210121`, and we save 4 digits.

We will prefix each integer with `1`, since now `0` could come at the beginning and it disappears without the prefix. So for example,

`032123314121331033104310509000210523310331043105090012106233103310431051010` 

will be prefixed with `1` and become

`1032123314121331033104310509000210523310331043105090012106233103310431051010`

otherwise the first `0` will disapper when being evaluated as a number.

```js
[
  1071022171298031733103310431051111297073120301310017143102311131173114042030,
  11131010301129903211310215123314092031000350920310013609203100237
]
```

Now it's much shorter than before. What's surprising here is that the entire JSON is compressed into just 2 integers in the end. It's just `uint[2]` in Solidity. This indeed is extreme efficiency! The zkJSON circuit by default allows up to 256 integers (256 * 76 safe digits), which can contain a huge JSON data size, and Solidity handles it efficiently with a dynamic array `uint[]`, which is optimized with [Yul](https://docs.soliditylang.org/en/latest/yul.html) assembly language. What's even better is that the only bits passed to Solidity is the tiny bits of the value at the queried path, and not the entire JSON bits. So if you are querying the value at the path `a`, `11111297`(path: "a") and `11311`(value: 1) are the only digits passed to Solidity as public signals of zkp.


To compare with zkJSON v1, v1 generates `uint[3]` for the same data. v2 is much more compact with dictionary and new value types.

```js
[
  1111129706210121298113100131431023111311731141211298113101030112990410113102,
  1032123314121331033104310509000210523310331043105090012106233103310431051010,
  10522107
]
```
