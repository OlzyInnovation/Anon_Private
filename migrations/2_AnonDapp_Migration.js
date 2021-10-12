const AnonDapp = artifacts.require('AnonDapp');

module.exports = function (deployer) {
  deployer.deploy(
    AnonDapp,
    'AnonDapp',
    'ANON',
    'https://ipfs.infura.io:5001/api/v0'
  );
};

//_name, _symbol, _initialBaseURI
