const { expect } = require("chai")
const { push, arr, toArray } = require("../../sdk/uint")
const { pad, path, val } = require("../../sdk/encoder")
const chai = require("chai")
const { join } = require("path")
const wasm_tester = require("circom_tester").wasm
const crypto = require("crypto")
const { parse } = require("../../sdk/parse")

function bitArray2buffer(a) {
  const len = Math.floor((a.length - 1) / 8) + 1
  const b = new Buffer.alloc(len)

  for (let i = 0; i < a.length; i++) {
    const p = Math.floor(i / 8)
    b[p] = b[p] | (Number(a[i]) << (7 - (i % 8)))
  }
  return b
}

function coerce(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array") return o
  if (o instanceof ArrayBuffer) return new Uint8Array(o)
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength)
  }
  throw new Error("Unknown type, must be binary type")
}

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const BASE = ALPHABET.length
const LEADER = ALPHABET.charAt(0)
const FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
const iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up

function toCID2(source) {
  var zeroes = 0
  var length = 0
  var pbegin = 0
  var pend = source.length
  while (pbegin !== pend && source[pbegin] === 0) {
    pbegin++
    zeroes++
  }
  var size = 47
  var b58 = new Uint8Array(size)
  while (pbegin !== pend) {
    var carry = source[pbegin]
    var i = 0
    for (
      var it1 = size - 1;
      (carry !== 0 || i < length) && it1 !== -1;
      it1--, i++
    ) {
      carry += (256 * b58[it1]) >>> 0
      b58[it1] = carry % 58 >>> 0
      carry = (carry / 58) >>> 0
    }
    length = i
    pbegin++
  }
  var it2 = size - length
  while (it2 !== size && b58[it2] === 0) it2++
  var str = LEADER.repeat(zeroes)
  for (; it2 < size; ++it2) str += ALPHABET.charAt(b58[it2])
  return str
}

function toCID(source) {
  // @ts-ignore
  if (source instanceof Uint8Array);
  else if (ArrayBuffer.isView(source)) {
    source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength)
  } else if (Array.isArray(source)) {
    source = Uint8Array.from(source)
  }
  if (!(source instanceof Uint8Array)) {
    throw new TypeError("Expected Uint8Array")
  }
  if (source.length === 0) {
    return ""
  }
  // Skip & count leading zeroes.
  var zeroes = 0
  var length = 0
  var pbegin = 0
  var pend = source.length
  while (pbegin !== pend && source[pbegin] === 0) {
    pbegin++
    zeroes++
  }
  // Allocate enough space in big-endian base58 representation.
  var size = ((pend - pbegin) * iFACTOR + 1) >>> 0
  var b58 = new Uint8Array(size)
  // Process the bytes.
  while (pbegin !== pend) {
    var carry = source[pbegin]
    // Apply "b58 = b58 * 256 + ch".
    var i = 0
    for (
      var it1 = size - 1;
      (carry !== 0 || i < length) && it1 !== -1;
      it1--, i++
    ) {
      carry += (256 * b58[it1]) >>> 0
      b58[it1] = carry % BASE >>> 0
      carry = (carry / BASE) >>> 0
    }
    if (carry !== 0) {
      throw new Error("Non-zero carry")
    }
    length = i
    pbegin++
  }
  // Skip leading zeroes in base58 result.
  var it2 = size - length
  while (it2 !== size && b58[it2] === 0) {
    it2++
  }
  // Translate the result into a string.
  var str = LEADER.repeat(zeroes)
  for (; it2 < size; ++it2) {
    str += ALPHABET.charAt(b58[it2])
  }
  return str
}

describe("JSON circuit", function () {
  let circuit
  this.timeout(0)

  before(async () => {
    circuit = await wasm_tester(join(__dirname, "index.circom"))
    await circuit.loadSymbols()
  })

  it("should insert docs", async () => {
    const json = {
      hello: "world!",
      world: "world war2 is starting...",
      hello2: "asjflksdajfklsdajfsklafs;ldafksdal;fksjadl;fkkljfsd",
    }
    const str = new TextEncoder().encode(JSON.stringify(json))
    const hash = coerce(crypto.createHash("sha256").update(str).digest())

    let encoded = arr(256)
    for (let v of Array.from(str)) encoded = push(encoded, 256, 9, v)
    const enc = parse(encoded, 256)
    const _path = pad(path("hello"), 5)
    const _val = pad(path("world!"), 5)
    const w = await circuit.calculateWitness(
      { encoded: encoded, path: _path, val: _val },
      true,
    )
    const _arr2 = w.slice(2, 34).map(n => Number(n))
    const cid2 = toCID2(new Uint8Array([18, hash.length, ..._arr2]))
    await circuit.checkConstraints(w)

    const cid = toCID(new Uint8Array([18, hash.length, ...Array.from(hash)]))
    expect(cid).to.eql(cid2)
    return
  })
})
