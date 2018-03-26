import React, { Component } from 'react';
import FaucetSetup from '../Components/FaucetSetup';
import FaucetBalance from '../Components/FaucetBalance';
import FaucetGame from '../Components/FaucetGame';

class Faucet extends Component {
	constructor(props) {
	    super(props);
	    this.state = {reward: 0,balance : 0,rewardTransaction : "",owner : '', ownerPassphase : '' , ownerConfirmPassphase : ''};
	    //console.log(this);
	    this.updateBalance = this.updateBalance.bind(this);
	    this.updateReward = this.updateReward.bind(this);
	    this.updateOwnerData = this.updateOwnerData.bind(this);
	}

	updateReward(newReward)
	{
		//console.log(this.state.reward);
		this.setState({reward :newReward });
		//console.log(this.state.reward);
	}
	updateBalance(newBalance)
	{
		//console.log(this.state.balance);
		this.setState({balance :newBalance });
		//console.log(this.state.balance);
	}

	updateOwnerData(ownerAddress,ownerPassphase,ownerConfirmPassphase)
	{
		/*console.log(ownerAddress);
		console.log(ownerPassphase);
		console.log(ownerConfirmPassphase);*/
		this.setState({owner :ownerAddress,ownerPassphase:ownerPassphase,ownerConfirmPassphase:ownerConfirmPassphase });
		/*console.log(this.state.owner);
		console.log(this.state.ownerPassphase);
		console.log(this.state.ownerConfirmPassphase);*/
	}


  	render() {
    return (
	      <div className="Faucet">
	      <h1>OX Game Faucet</h1>
			<FaucetSetup updateBalance={this.updateBalance} updateReward={this.updateReward}  updateOwnerData={this.updateOwnerData}/>
			<FaucetBalance balance={this.state.balance} reward={this.state.reward}/>
			<FaucetGame balance={this.state.balance} reward={this.state.reward} owner = {this.state.owner} ownerPassphase = {this.state.ownerPassphase} rewardTransaction = {this.state.rewardTransaction}/>
	      </div>
	    );
	}
}

export default Faucet;