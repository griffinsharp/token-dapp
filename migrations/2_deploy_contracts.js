const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function (deployer, network, accounts) {
  // Deploy Mock DAI Token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  await deployer.deploy(TokenFarm);
  const tokenFarm = await TokenFarm.deployed();

  deployer.deploy(TokenFarm);
};
