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

  describe('Mock Dai Deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    })
  })

  describe('DApp Token Deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name();
      assert.equal(name, 'DApp Token');
    })

    it('should transfer to the investor (account[1])', async () => {
      let balance = await daiToken.balanceOf(investor);
      assert.equal(balance.toString(), tokens('100'))
    });
  })

  describe('Token Farm Deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name();
      assert.equal(name, 'Dapp Token Farm');
    });

    it('has a contract with dapp tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens('1000000'));
    });
  })

  describe('Farming Tokens', async () => {
    it('rewards investors for staking mDai tokens', async () => {
      let result;

      // Check investor balance befores staking / before stakeToken func is called
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct before staking');

      // Approve staking of mock dai tokens
      // Stake mock dai tokens in the token farm
      const metaData = {from: investor};
      await daiToken.approve(tokenFarm.address, tokens('100'), metaData);
      await tokenFarm.stakeTokens(tokens('100'), metaData);

      // Check staking results
      const investorDaiBal = await daiToken.balanceOf(investor);
      assert.equal(investorDaiBal.toString(), tokens('0'), 'Investor Mock DAI wallet balance correct after staking')

      const tokenFarmDaiBal = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(tokenFarmDaiBal.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

      // Check staking balance
      const tokenFarmStakingBal = await tokenFarm.stakingBalance(investor);
      assert.equal(tokenFarmStakingBal.toString(), tokens('100'), 'Investor staking balance correct after staking')

      // Check isStaking true
      const isStaking = await tokenFarm.isStaking(investor);
      assert.equal(isStaking.toString(), 'true', 'investor staking status correct after staking');


      // Issue Tokens
      await tokenFarm.issueTokens(metaData);

      // Check balances after the issuance of dapp tokens
      investorDappBalance = await dappToken.balanceOf(investor);
      assert.equal(investorDappBalance, tokens('100'), 'Investor DApp token wallet balance correct after issuance')

      // Ensure that only owner can issue new tokens
      await tokenFarm.issueTokens({from: investor}).should.be.rejected;
    });
  })
});