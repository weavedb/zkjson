// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")

async function main() {
  const VerifierJSON = await hre.ethers.getContractFactory(
    "Groth16VerifierJSON"
  )
  const verifierJSON = await VerifierJSON.deploy()
  await verifierJSON.deployed()
  console.log("verifier", verifierJSON.address)

  const ZKAR = await hre.ethers.getContractFactory("ZKArweave")
  const zkar = await ZKAR.deploy(
    verifierJSON.address,
    "0x078694d69426112c7df330732e28F5117B02727A"
  )

  await zkar.deployed()

  console.log("zkar", zkar.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
