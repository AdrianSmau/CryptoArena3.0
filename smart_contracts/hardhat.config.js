require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
const { privateKey, ropstenUrl, rinkebyUrl } = require("./secrets.json");

module.exports = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: false,
        },
      },
    },
  },
  networks: {
    ropsten: {
      url: ropstenUrl,
      accounts: [privateKey],
    },
    rinkeby: {
      url: rinkebyUrl,
      accounts: [privateKey],
    },
  },
};
