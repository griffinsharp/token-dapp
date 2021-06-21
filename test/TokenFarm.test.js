const { assert } = require('chai');

const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
  .use(require('chai-as-promised'))
  .should()

// Helpers
const tokens = (n) => web3.utils.toWei(n, 'ether');

// Break accounts param into owner and investor (first two accounts)
contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  // Recreate migration
  before(async () => {
    // Load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // Transfer all Dapp tokens to TokenFarm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'));

    // Send tokens to investor
    // Include metadata to be explicit about the address that deployed the DappToken to the network (owner)
    const metaData = { from: owner };
    await daiToken.transfer(investor, tokens('100'), metaData)
  })

  describe('Mock Dai deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    })
  })

  describe('DApp Token deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name();
      assert.equal(name, 'DApp Token');
    })

    it('should transfer to the investor (account[1])', async () => {
      let balance = await daiToken.balanceOf(investor);
      assert.equal(balance.toString(), tokens('100'))
    });
  })

  describe('Token Farm', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name();
      assert.equal(name, 'Dapp Token Farm');
    });

    it('has a contract with dapp tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens('1000000'))
    });
  })
});