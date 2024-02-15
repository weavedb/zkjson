const snarkjs = require("snarkjs")
const { push, arr, toArray } = require("../../sdk/uint")
const { parse } = require("../../sdk/parse")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { resolve } = require("path")
const { pad, path, val } = require("../../sdk/encoder")

async function deploy() {
  const [owner, user] = await ethers.getSigners()
  const VerifierIPFS = await ethers.getContractFactory("Groth16VerifierIPFS")
  const verifierIPFS = await VerifierIPFS.deploy()
  const ZKNFT = await ethers.getContractFactory("ZKNFT")
  const zknft = await ZKNFT.deploy(verifierIPFS.address)
  return { zknft, owner, user }
}

describe("zkNFT", function () {
  this.timeout(0)
  it("Should query metadata", async function () {
    const { user, owner, zknft } = await loadFixture(deploy)
    await zknft.mint(user.address, "ipfs://xyz")
    const json = { hello: "world" }
    const str = new TextEncoder().encode(JSON.stringify(json))
    let encoded = arr(256)
    for (let v of Array.from(str)) encoded = push(encoded, 256, 9, v)
    const enc = parse(encoded, 256)
    const _path = pad(path("hello"), 5)
    const _val = pad(val("world"), 5)
    const inputs = { path: _path, val: _val, encoded }
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      resolve(
        __dirname,
        "../../circom/build/circuits/ipfs/index_js/index.wasm",
      ),
      resolve(__dirname, "../../circom/build/circuits/ipfs/index_0001.zkey"),
    )
    const zkp = [
      ...proof.pi_a.slice(0, 2),
      ...proof.pi_b[0].slice(0, 2).reverse(),
      ...proof.pi_b[1].slice(0, 2).reverse(),
      ...proof.pi_c.slice(0, 2),
      ...publicSignals,
    ]
    expect(await zknft.qString(_path, zkp)).to.eql("world")
  })
})
