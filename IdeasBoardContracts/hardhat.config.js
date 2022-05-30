require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.1",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/xi4d9SyHM9931xbTVrfAJ4bx5YrmapD3",
      accounts: ["8f5417b82c2d425cf7aa40baab5fe3bab30fde46167de66261e984e71f8fa9f2"]
    },
  },
};