module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // Updated to 8545 to match your running ganache-cli
      network_id: "*",
    },
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.0",
    }
  },
};
