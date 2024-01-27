const { DB } = require("../../sdk")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { resolve } = require("path")
async function deploy() {
  const [owner, user] = await ethers.getSigners()
  const Yul = await ethers.getContractFactory("Yul")
  const yul = await Yul.deploy()
  return { yul }
}

describe("zkDB", function () {
  this.timeout(0)
  let yul
  beforeEach(async () => {
    const dep = await loadFixture(deploy)
    yul = dep.yul
  })
  it("Should transfer point token", async function () {
    console.log(await yul.test())
  })
})
