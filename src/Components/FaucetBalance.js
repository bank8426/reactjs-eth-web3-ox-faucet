import React, { Component } from 'react';

class FaucetBalance extends Component {
	constructor(props) {
	    super(props);
	    this.state = {reward: 0 , balance : 0};
	    
	    //console.log(this);
	}



  	render() {
    return (
	      <div className="FaucetBalance">
	      <h2>Faucet Balance</h2>
			<label>
				Faucet balance: {this.props.balance}
			</label>
			<br/><br/>
			<label>
				Reward per win: {this.props.reward}
			</label>
	      </div>
	    );
	}
}

export default FaucetBalance;