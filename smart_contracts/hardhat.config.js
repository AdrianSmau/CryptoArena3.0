require("@nomiclabs/hardhat-waffle");
const {privateKey,ropstenUrl, rinkebyUrl}  = require('./secrets.json')

module.exports = {
  solidity: "0.8.4",
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