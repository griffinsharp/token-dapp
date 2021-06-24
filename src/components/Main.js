import React, { Component } from 'react';

import dai from '../dai.png';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stakeDaiAmount: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  // Helpers
  handleChange(event, field) {
    this.setState({
      [field]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const amtWei = this.state.stakeDaiAmount.toString();
    const amtEth = window.web3.utils.toWei(amtWei, 'Ether');
    this.props.stakeTokens(amtEth);
  }

  render() {
    return(
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
              <td>{window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')} DAPP</td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4">
          <div className="card-body">
            <form className="mb-3" onSubmit={this.handleSubmit}>
              <div>
                <label className="float-left"><b>Stake Tokens</b></label>
                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  onChange={e => this.handleChange(e, 'stakeDaiAmount')}
                  className="form-control form-control-lg"
                  placeholder="0"
                  value={this.state.stakeDaiAmt}
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height='32' alt="" />
                    &nbsp;&nbsp;&nbsp; mDAI
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
            </form>
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault();
                this.props.unstakeTokens();
              }}
              >
              UNSTAKE
            </button>
          </div>
        </div>

      </div>
    );
  }
}

export default Main;