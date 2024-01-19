require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/xxx",
      accounts: ["xxx"],
    },
  },
}
