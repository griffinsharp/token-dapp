pragma solidity ^0.5.0;

import './DappToken.sol';
import './DaiToken.sol';

contract TokenFarm {
    string public name = 'Dapp Token Farm';
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    // Array of addresses
    address[] public stakers;
    // Maps address to staking amt
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;


    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // Stake tokens (deposit)
    function stakeTokens(uint _amount) public {
        // Require amount staking is greater than zero
        require(_amount > 0, "Amount must be greater than 0.");

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

    // Issue interest on staked tokens
    function issueTokens() public {
        // Must be the owner who calls the function
        require(msg.sender == owner, 'Caller must be the owner.');

        // Iterate over stakers arr, issue dapp tokens based on the amount of Dai staked (1:1)
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint amountStaking = stakingBalance[recipient];
            if (amountStaking > 0) dappToken.transfer(recipient, amountStaking);
        }
    }

     function unstakeTokens() public {
        // Return the staked balance
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'Staking balance cannot be 0.');
        daiToken.transfer(msg.sender, balance);

        // Reset staking balance to zero and staking status to false
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }
}
