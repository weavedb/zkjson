const NFT = require("../../sdk/nft")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { resolve } = require("path")

const wasm = resolve(
  __dirname,
  "../../circom/build/circuits/ipfs/index_js/index.wasm",
)
const zkey = resolve(
  __dirname,
  "../../circom/build/circuits/ipfs/index_0001.zkey",
)

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
    const json = {
      str: "Hello, World!",
      int: 123,
      bool: true,
      null: null,
      float: 1.23,
      arr: [1, 2, 3, true, null, "hello", 3.14],
    }
    const nft = new NFT({ wasm, zkey, json })
    const cid = nft.cid()
    await zknft.mint(user.address, `ipfs://${cid}`)

    // query string
    expect(
      await zknft.qString(0, nft.path("str"), await nft.zkp("str")),
    ).to.eql(json["str"])

    // query int
    expect(
      (await zknft.qInt(0, nft.path("int"), await nft.zkp("int"))).toNumber(),
    ).to.eql(json["int"])

    // query bool
    expect(
      await zknft.qBool(0, nft.path("bool"), await nft.zkp("bool")),
    ).to.eql(json["bool"])

    // query null
    expect(
      await zknft.qNull(0, nft.path("null"), await nft.zkp("null")),
    ).to.eql(true)

    // query float
    expect(
      (await zknft.qFloat(0, nft.path("float"), await nft.zkp("float"))).map(
        n => n.toNumber(),
      ),
    ).to.eql([1, 2, 123])

    // custom
    expect(
      (
        await zknft.qCustom(
          0,
          nft.path("arr"),
          nft.path("[1]"),
          await nft.zkp("arr"),
        )
      ).toNumber(),
    ).to.eql(2)

    // query cond
    expect(
      await zknft.qCond(
        0,
        nft.path("int"),
        nft.query("int", ["$gt", 100]),
        await nft.zkp("int", ["$gt", 100]),
      ),
    ).to.eql(true)

    expect(
      await zknft.qCond(
        0,
        nft.path("arr"),
        nft.query("arr", ["$contains", 2]),
        await nft.zkp("arr", ["$contains", 2]),
      ),
    ).to.eql(true)
  })
})
