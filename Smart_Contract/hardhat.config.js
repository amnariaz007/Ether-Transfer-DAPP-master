

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    Goerli: {
      url: 'https://goerli.infura.io/v3/0d84580c415e49ad8b44f443c06a43a1',
      accounts: ['0c7f272a9011d24decd8d335fc15d6b275c0773ac0466110e660218963006cc9'],
    },
  },
};

//  0xBbA02ca07173e338af3Df30700CE211EEF87b6C4