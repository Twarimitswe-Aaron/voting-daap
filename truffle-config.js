require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const privateKeyOrMnemonic = process.env.PRIVATE_KEY; 
const alchemyURL = process.env.ALCHEMY_URL;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    sepolia: {
      provider: () => new HDWalletProvider(privateKeyOrMnemonic, alchemyURL),
      network_id: 11155111,       // Sepolia's chain ID
      gas: 5500000,               // Gas limit
      confirmations: 2,           // Wait for 2 confirmations
      timeoutBlocks: 200,         // Wait time before timing out
      skipDryRun: true,           // Skip dry run
      networkCheckTimeout: 1000000 // Prevent Truffle from timing out on public nodes
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.0",
    }
  },
};
