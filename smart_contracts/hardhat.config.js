require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
const {privateKey,ropstenUrl, rinkebyUrl}  = require('./secrets.json')

module.exports = {
  solidity: "0.8.10",
  networks: {
    ropsten: {
      url: ropstenUrl,
      accounts: [privateKey]
    },
    rinkeby: {
      url: rinkebyUrl,
      accounts: [privateKey]
    }
  }
};
