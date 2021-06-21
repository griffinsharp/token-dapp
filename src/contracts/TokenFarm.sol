pragma solidity ^0.5.0;

import './DappToken.sol';
import './DaiToken.sol';

contract TokenFarm {
    string public name = 'Dapp Token Farm';
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    // Maps address to staking amt
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;


    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }

    // 1. Stake tokens (deposit)
    function stakeTokens(uint _amount) public {
        // Transfer mock dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // If they havent staked already, add user to stakers array
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // 2. Unstake tokens (withdrawal)

    // 3. Issue interest on staked tokens
}
