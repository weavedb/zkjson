const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { path, Doc } = require("../../sdk")
const { resolve } = require("path")
const { expect } = require("chai")
async function deploy() {
  const Verifier = await ethers.getContractFactory("Groth16VerifierJSON")
  const verifier = await Verifier.deploy()
  const MyApp = await ethers.getContractFactory("SimpleJSON")
  const myapp = await MyApp.deploy(verifier.address)
  return { myapp }
}

describe("MyApp", function () {
  let myapp
  this.timeout(0)

  beforeEach(async () => {
    const dep = await loadFixture(deploy)
    myapp = dep.myapp
  })

  it("should verify JSON", async function () {
    const doc = new Doc({
      wasm: resolve(
        __dirname,
        "../../circom/build/circuits/json/index_js/index.wasm"
      ),
      zkey: resolve(
        __dirname,
        "../../circom/build/circuits/json/index_0001.zkey"
      ),
    })
    const json = {
      num: 1,
      float: 1.23,
      str: "string",
      bool: true,
      null: null,
      array: [1, 2, 3],
    }

    // query number
    const zkp = await doc.genProof({ json, path: "num" })
    expect((await myapp.qInt(path("num"), zkp)).toNumber()).to.eql(1)

    // query string
    const zkp2 = await doc.genProof({ json, path: "str" })
    expect(await myapp.qString(path("str"), zkp2)).to.eql("string")

    // query bool
    const zkp3 = await doc.genProof({ json, path: "bool" })
    expect(await myapp.qBool(path("bool"), zkp3)).to.eql(true)

    // query null
    const zkp4 = await doc.genProof({ json, path: "null" })
    expect(await myapp.qNull(path("null"), zkp4)).to.eql(true)

    // query float
    const zkp5 = await doc.genProof({ json, path: "float" })
    expect(
      (await myapp.qFloat(path("float"), zkp5)).map(f => f.toNumber())
    ).to.eql([1, 2, 123])

    // query array and get number
    const zkp6 = await doc.genProof({ json, path: "array" })
    expect(
      (await myapp.qCustom(path("array"), path("[1]"), zkp6)).toNumber()
    ).to.eql(2)
  })
})
