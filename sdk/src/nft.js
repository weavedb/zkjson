import crypto from "crypto"
import { groth16 } from "snarkjs"
import { query, pad, path, val } from "./encoder.js"
import { push, arr } from "./uint.js"
import { parse } from "./parse.js"

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
const FACTOR = Math.log(BASE) / Math.log(256)
const iFACTOR = Math.log(256) / Math.log(BASE)

function toCID(source) {
  if (source instanceof Uint8Array);
  else if (ArrayBuffer.isView(source)) {
    source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength)
  } else if (Array.isArray(source)) {
    source = Uint8Array.from(source)
  }
  if (!(source instanceof Uint8Array)) {
    throw new TypeError("Expected Uint8Array")
  }
  if (source.length === 0) return ""

  var zeroes = 0
  var length = 0
  var pbegin = 0
  var pend = source.length
  while (pbegin !== pend && source[pbegin] === 0) {
    pbegin++
    zeroes++
  }

  var size = ((pend - pbegin) * iFACTOR + 1) >>> 0
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
      b58[it1] = carry % BASE >>> 0
      carry = (carry / BASE) >>> 0
    }
    if (carry !== 0) {
      throw new Error("Non-zero carry")
    }
    length = i
    pbegin++
  }
  var it2 = size - length
  while (it2 !== size && b58[it2] === 0) {
    it2++
  }
  var str = LEADER.repeat(zeroes)
  for (; it2 < size; ++it2) {
    str += ALPHABET.charAt(b58[it2])
  }
  return str
}

export default class NFT {
  constructor({
    size_val = 34,
    size_path = 5,
    size_json = 256,
    wasm,
    zkey,
    json,
  }) {
    this.json = json
    this.wasm = wasm
    this.zkey = zkey
    this.size_val = size_val
    this.size_path = size_path
    this.size_json = size_json
  }
  path(pth) {
    return pad(path(pth), this.size_path)
  }
  val(pth) {
    return pad(val(this.json[pth]), this.size_val)
  }
  query(pth, cond) {
    return pad(query(cond), this.size_val)
  }

  async zkp(pth, cond) {
    const str = new TextEncoder().encode(JSON.stringify(this.json))
    let encoded = arr(256)
    for (let v of Array.from(str))
      encoded = push(encoded, this.size_json, 76, v)
    const enc = parse(encoded, 256)
    const _path = this.path(pth)
    const _val = Array.isArray(cond) ? this.query(pth, cond) : this.val(pth)
    const inputs = { path: _path, val: _val, encoded }
    const { proof, publicSignals } = await groth16.fullProve(
      inputs,
      this.wasm,
      this.zkey,
    )
    return [
      ...proof.pi_a.slice(0, 2),
      ...proof.pi_b[0].slice(0, 2).reverse(),
      ...proof.pi_b[1].slice(0, 2).reverse(),
      ...proof.pi_c.slice(0, 2),
      ...publicSignals,
    ]
  }
  cid() {
    const str = new TextEncoder().encode(JSON.stringify(this.json))
    const hash = coerce(crypto.createHash("sha256").update(str).digest())
    return toCID(new Uint8Array([18, hash.length, ...Array.from(hash)]))
  }
}
