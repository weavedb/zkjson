const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { Doc, toSignal, encodePath } = require("../../sdk")
const { resolve } = require("path")
const { expect } = require("chai")
async function deploy() {
  const [owner] = await ethers.getSigners()
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

  it("Should verify rollup transactions", async function () {
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
    expect(
      (await myapp.qInt(toSignal(encodePath("num")), zkp)).toNumber()
    ).to.eql(1)

    // query string
    const zkp2 = await doc.genProof({ json, path: "str" })
    expect(await myapp.qString(toSignal(encodePath("str")), zkp2)).to.eql(
      "string"
    )

    // query bool
    const zkp3 = await doc.genProof({ json, path: "bool" })
    expect(await myapp.qBool(toSignal(encodePath("bool")), zkp3)).to.eql(true)

    // query null
    const zkp4 = await doc.genProof({ json, path: "null" })
    expect(await myapp.qNull(toSignal(encodePath("null")), zkp4)).to.eql(true)

    // query float
    const zkp5 = await doc.genProof({ json, path: "float" })
    expect(
      (await myapp.qFloat(toSignal(encodePath("float")), zkp5)).map(f =>
        f.toNumber()
      )
    ).to.eql([1, 2, 123])

    // query array and get number
    const zkp6 = await doc.genProof({ json, path: "array" })
    expect(
      (
        await myapp.qCustom(
          toSignal(encodePath("array")),
          toSignal(encodePath("[1]")),
          zkp6
        )
      ).toNumber()
    ).to.eql(2)
  })
})
