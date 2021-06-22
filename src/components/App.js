import React, { Component } from 'react'

import Navbar from './Navbar'
import './App.css'

import Web3 from 'web3';

import DaiToken from '../abis/DaiToken.json';
import DappToken from '../abis/DappToken.json';
import TokenFarm from '../abis/TokenFarm.json';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  // Fetch web3 from window, get accounts from web3
  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    accounts.length === 1 ? this.setState({account: accounts[0]}) : window.alert('More than 1 account loaded!');

    // Detect network & load network id
    const networkId = await web3.eth.net.getId();

    // TODO: The below is super repetitive, clean it up with a new helper fn.

    // Load Dai Token network address
    const daiAddress = DaiToken.networks[networkId].address;
    if (daiAddress) {
      // JS version of contract - Need ABI and address
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiAddress);
      this.setState({daiToken});

      // Get balance of Dai
      const daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call();
      this.setState({daiTokenBalance: daiTokenBalance.toString()});
      console.log({daiTokenBalance});
    } else {
      window.alert('DaiToken contract not deployed to detected network!')
    }

    const dappAddress = DappToken.networks[networkId].address;
    if (dappAddress) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappAddress);
      this.setState({dappToken});

      // Get balance of Dapp
      const dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call();
      this.setState({dappTokenBalance: dappTokenBalance.toString()});
      console.log({dappTokenBalance});
    } else {
      window.alert('dappToken contract not deployed to detected network!')
    }

    const tokenFarmAddress = TokenFarm.networks[networkId].address;
    if (tokenFarmAddress) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmAddress);
      this.setState({tokenFarm});

      // Get staking balance
      const tokenFarmBalance = await tokenFarm.methods.stakingBalance(this.state.account).call();
      this.setState({tokenFarmBalance: tokenFarmBalance.toString()});
      console.log({tokenFarmBalance});
    } else {
      window.alert('tokenFarm contract not deployed to detected network!')
    }

    this.setState({loading: false});
  }

  // Load web3 into the window
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                </a>
                <h1>Hello, World!</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
