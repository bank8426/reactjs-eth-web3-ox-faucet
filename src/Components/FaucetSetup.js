import React, { Component } from 'react';
import Web3 from 'web3';

class FaucetSetup extends Component {
	constructor(props) {
	    super(props);
	    this.state = {reward: 0,owner : '', ownerPassphase : '' , ownerConfirmPassphase : '' , balance : 0};

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.handleSubmitReward = this.handleSubmitReward.bind(this);
	    this.displayFaucetBalance = this.displayFaucetBalance.bind(this);
	    //console.log(this);
	}

	handleChange(event) {
	  	const target = event.target;
	    const name = target.name;
	    const value = target.value;
	    this.setState({
	      [name]: value
	    });
	    //console.log(name + value);
	}

	//new account address can show by set state of "newAccount"
	displayFaucetBalance(parent,getBalanceResult){

	  	this.setState({balance: getBalanceResult});
	  	//console.log(parent.props)

	  	parent.props.updateBalance(getBalanceResult);
		console.log("get balance complete");

	}

	//get faucet balance 
	handleSubmit(event) {

	  	//if passphase and confirm match then start create new account
	  	if(this.state.ownerPassphase === this.state.ownerConfirmPassphase)
	  	{
	  		//console.log("yes");
	  		//connect
	    	var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	    	//unlock account to verify passphase
	    	var unlockSenderAccount = web3.eth.personal.unlockAccount(this.state.owner, this.state.ownerPassphase, 3)
	    	//get balance
	    	var parent = this;
	    	//console.log(this.state.owner)
	    	//console.log(this.state.ownerPassphase)
	    	//console.log(this.state.ownerConfirmPassphase)
	    	this.props.updateOwnerData(this.state.owner, this.state.ownerPassphase, this.state.ownerConfirmPassphase)
	        web3.eth.getBalance(this.state.owner).then(getBalanceResult => this.displayFaucetBalance(parent, getBalanceResult));


	        /*.then(function(getBalanceResult,parent) {
	        	console.log(parent)
  				console.log(getBalanceResult)
			});*/


	        //then(this.displayFaucetBalance,parent);
	  	}
	  	else
	  	{
	  		alert('Error : Passphase and Confirm-Passphase not match');
	  		this.setState({ownerPassphase : '' , ownerConfirmPassphase : '' , balance : 0});
	  	}

	    event.preventDefault();
	}


	handleSubmitReward(event) {

	  	//console.log(this);
	  	this.setState({reward : this.state.reward });
	  	this.props.updateReward(this.state.reward);
	  	//this.props.state.reward
	  	//props.reward = event
	    event.preventDefault();
	}

  	render() {
    return (
      <div className="FaucetSetup" style={{backgroundColor: "LightGreen"}}>
      	
      	<h2>Faucet Setup</h2>
		<form onSubmit={this.handleSubmit}>
	        <label>
				Owner address:
				<textarea type="text" name="owner"  value={this.state.owner} onChange={this.handleChange} />
			</label>
			<br/><br/>
			<label>
				Owner-Passphase:
			 	<input type="password" name="ownerPassphase"  value={this.state.ownerPassphase} onChange={this.handleChange} />
			</label>
			<br/><br/>
			<label>
				Owner-Confirm-Passphase:
			 	<input type="password" name="ownerConfirmPassphase"  value={this.state.ownerConfirmPassphase} onChange={this.handleChange} />
			</label>
			<br/><br/>
	        <input type="submit" value="Login" />
	        <br/><br/>
      	</form>

      	<label>
			Owner balance: {this.state.balance}
		</label>
		<br/><br/>


		<form onSubmit={this.handleSubmitReward}>
			<label>
				Reward per faucet claim(wei)(Fee ~ 21000000000000):
			 	<input type="number" name="reward"  value={this.state.reward} onChange={this.handleChange} />
			</label>
			<input type="submit" value="Confirm" />
		</form>

		<br/><br/>
      </div>
    );
  }
}

export default FaucetSetup;
