import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import './FaucetGame.css';

function Square(props) {
  //console.log(props);
  return (
    <button id={props.id} className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square id={i} key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  
  renderBoard() {
    let items = [];
    for (let  i= 0;  i< 3; i++) {
      let itemsJ = [];
      for (let j = 0; j < 3; j++) {
        itemsJ.push(this.renderSquare(i*3+j));
      }
      items.push(<div key={i} className="board-row">{itemsJ}</div>);
    }
    return <div>{items}</div>;
  }
  

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class FaucetGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          value:-1,
        }
      ],
      stepNumber: 0,
      jumpToNumber:-1,
      xIsNext: true,
      bAscending: true,
      player:"",
      sender : "" ,
      senderPassphase : "",
      rewardTransaction : ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.createNewTransaction = this.createNewTransaction.bind(this);
    this.createNewTransaction2 = this.createNewTransaction2.bind(this);
    this.displayNewTransaction = this.displayNewTransaction.bind(this);
  }

  //new account address can show by set state of "newAccount"
	displayNewTransaction(sendTransactionResult){
	  	this.setState({rewardTransaction: sendTransactionResult.transactionHash});
	  	console.log(sendTransactionResult);
		console.log("send complete");
	}

	playerGetReward()
	{
		this.jumpTo(0)
		//connect
		var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		//console.log(this)
		var senderAddress = this.props.owner;
		var senderPassphase = this.props.ownerPassphase

	  	//unlock account then go create transaction
	  	var unlockSenderAccount = web3.eth.personal.unlockAccount(senderAddress, senderPassphase, 3)
        unlockSenderAccount.then(this.createNewTransaction);
	}

	createNewTransaction(unlockSenderAccountResult){
		var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		//console.log(this)
		var senderAddress = this.props.owner;
		var senderPassphase = this.props.ownerPassphase
		var receiverAddress = this.state.player;
		var amountToSend = this.props.reward
		/*console.log(senderAddress);
		console.log(receiverAddress);
		console.log(amountToSend);*/
		//create a new transaction object 
		var transactionObject = {
		    from: senderAddress,
		    to: receiverAddress,
		    value: amountToSend
		}
		//console.log(transactionObject);

		/*calculate value of transfer - the calculated fee that is required to send the transaction. 
		The fee is calculated by the formula GasPrice * RequiredGas.*/
		web3.eth.estimateGas(transactionObject, this.createNewTransaction2 );
		
	}

	createNewTransaction2(error, gas){
		var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		var senderAddress = this.props.owner;
		var senderPassphase = this.props.ownerPassphase
		var receiverAddress = this.state.player;
		var amountToSend = this.props.reward
		var sendTransactionResult;
		//create a new transaction object 
		var transactionObject = {
		    from: senderAddress,
		    to: receiverAddress,
		    value: amountToSend
		}
		var displayNewTransaction = this.displayNewTransaction;
		//console.log(this);
		this.setState({rewardTransaction: "Please wait"});
		web3.eth.getGasPrice(function (error, gasPrice) {
			var gasPrice = Number(gasPrice);
			var transactionFee = gasPrice * gas;
			//console.log("Fee : " + transactionFee);
			//ethereum
			transactionObject.value = (transactionObject.value - transactionFee);

			
			console.log("sending transaction : please wait")
			//send transaction
			var sendTransaction = web3.eth.sendTransaction(transactionObject);
			//sendTransactionResult = sendTransaction
			//asd();
			sendTransaction.then(displayNewTransaction);
			//console.log(sendTransaction);
		})//.then(this.displayNewTransaction(sendTransactionResult));
		//this.setState({value: 0, sender : "" ,senderPassphase : "" , receiver : "" ,receiverPassphase : ""});
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

  handleClick(i,player) {
    //check player and bot turn before process  
    var currentPlayer = this.state.xIsNext ? "X" : "O"
    if(player == currentPlayer)
    {
      //console.log(this)
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const historyValue = this.state.value;
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      //console.log(historyValue);
      //if
      if (calculateWinner(squares) || squares[i]) {

        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares,
            value:i,
          }
        ]),
        jumpToNumber:-1,
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
    else
    {
      console.log("invalid player");
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      jumpToNumber:step,
      xIsNext: (step % 2) === 0
    });
    //console.log(step);
  }
  
  toggleAscending()
  {
    this.setState({
      bAscending : !this.state.bAscending,
    });
    //console.log(this.state.bAscending);
  }

  turnAI(parent) {
    //console.log(parent);

    //get current board data
    const history = parent.state.history.slice();
    //console.log(history[parent.state.stepNumber])
    const current = history[parent.state.stepNumber].squares;
    //console.log(current)

    //let ai find square to win in current board as O player
    var thinkingSquare  = calculateAI(current , "O");
    var choosenSquare = 0;
    var i = 0;
    //if think as O can't win 
    if(thinkingSquare < 0)
    {
      //let ai find square to win in current board as X player
      thinkingSquare = calculateAI(current , "X");
      //if think as X player can't win then go random
      if(thinkingSquare < 0)
      {
        //if can't win in current situation then random 
        //find empty position
        var emptyPosition = [];
        for ( i = 0; i < current.length; i++) {
          if(current[i] === null)
          {
            emptyPosition.push(i);
          } 
        }
        //console.log(emptyPosition);
        //then random
        choosenSquare = emptyPosition[Math.floor((Math.random() * emptyPosition.length) )];
      }
      //if  X player can win then block it
      else
      {
        choosenSquare = thinkingSquare
      }
    }
    //if can win go for it
    else
    {
      choosenSquare = thinkingSquare
    }
    

    
    //console.log(choosenSquare);
    parent.handleClick(choosenSquare,"O");
    /*console.log(handleClick);
    //handleClick(1);
    //this.handleClick(0);
    //*/
    //return 0;
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const handleClick = this.handleClick;
    /*const history2 = this.state.history.slice();
    console.log(history2.reverse());*/
    //console.log(step);


    const moves = history.map((step, move) => {
      /*console.log(move);
      console.log(step);*/

      const desc = move ?
        'Go to move #' + move + '(' + history[move].value%3 + ',' + Math.floor(history[move].value/3) +')':
        'Go to game start';
      
      if(move==this.state.jumpToNumber)
      {
        return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
        </li>
      );
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
      //console.log(history[move].value);
      
    });

    let status;
    //found winner
    if (winner) {
      status = "Winner: " + winner;
      if(winner=="X")
      {
      	console.log("you get reward")
      	this.playerGetReward();

      }
    } 
    //all board fill but no winner
    else if(this.state.stepNumber == 9 )
    {
      status = "Draw !!";
      //console.log("this.state.stepNumber : " + this.state.stepNumber)
    }
    //if no one win yet
    else {
      
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");

      //ai part //O will be ai player
      const xIsNext = this.state.xIsNext ? "X" : "O";
      if(xIsNext=="O")
      {
        setTimeout(this.turnAI, 500 , this);
        //delayBeforeAI().then(calculateAI);
        //delayBeforeAI().then(this.calculateAI);
        /*console.log(xIsNext + " : AI turn");*/
        
      }
    }
    
    let toggle;
    if(this.state.bAscending)
    {
      toggle = "Ascending";
    }
    else
    {
      toggle = "Descending";
      moves.reverse();
    }

    //console.log(toggle +" "+ this.state.bAscending);
    
    return (
    	<div className="FaucetGame" style={{ backgroundColor: 'LightCoral' }}>
    		<h2>FaucetGame</h2>
    		<label>
				Player address:
				<textarea type="text" name="player"  value={this.state.player} onChange={this.handleChange} />
			</label>
			<br/><br/>
		     <div className="game">
		        <div className="game-board">
		          <Board
		            squares={current.squares}
		            onClick={i => this.handleClick(i,"X")}
		          />
		        </div>
		        <div className="game-info">
		        	<div>{status}</div>
		        	<ol>
		        	<li key={0}>
			          <button onClick={() => this.jumpTo(0)}><b>Go to game start</b></button>
			        </li>
			        </ol>
		        </div>
      		</div>
      		<br/>
      		<label>
				Reward transaction: 
				<textarea  type="text" name="transactionHash"  value={this.state.rewardTransaction} readOnly/>
				
			</label>
      	</div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  var elems = document.querySelectorAll('.square.win');
  
  [].forEach.call(elems, function(el) {
      //console.log(el.className);
      el.classList.remove('win');
  });
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //console.log(a +' '+ b +' '+ c);
      document.getElementById(a).classList.add('win'); 
      document.getElementById(b).classList.add('win');
      document.getElementById(c).classList.add('win');
      //console.log(document.getElementById(a));
      return squares[a];
    }
  }
  return null;
}

function calculateAI(currentBoard,player) {
  var i = 0;
  //ai is O player
  //check crossline win
  if(currentBoard[0] ===null &&currentBoard[4] === player &&currentBoard[8] ===player)
  {
    return 0;
  }
  else if(currentBoard[0] ===player &&currentBoard[4] === null &&currentBoard[8] ===player)
  {
    return 4;
  }
  else if(currentBoard[0] ===player &&currentBoard[4] === player &&currentBoard[8] ===null)
  {
    return 8;
  }
  else if(currentBoard[2] ===null &&currentBoard[4] === player &&currentBoard[6] ===player)
  {
    return 2;
  }
  else if(currentBoard[2] ===player &&currentBoard[4] === null &&currentBoard[6] ===player)
  {
    return 4;
  }
  else if(currentBoard[2] ===player &&currentBoard[4] === player &&currentBoard[6] ===null)
  {
    return 6;
  }
  else
  {
    //check each line
    for ( i = 0; i < 2; i++) { 
      //check by column
      if(currentBoard[i*1] === null && currentBoard[(i*1)+3] === player && currentBoard[(i*1)+6] === player)
      {
        return i*1;
      }
      else if(currentBoard[i*1] === player && currentBoard[(i*1)+3] === null && currentBoard[(i*1)+6] === player)
      {
        return (i*1)+3;
      }
      else if(currentBoard[i*1] === player && currentBoard[(i*1)+3] === player && currentBoard[(i*1)+6] === null)
      {
        return (i*1)+6;
      }
      //check by row
      else if(currentBoard[i*3] === null && currentBoard[(i*3)+1] === player && currentBoard[(i*3)+2] === player)
      {
        return (i*3);
      }
      else if(currentBoard[i*3] === player && currentBoard[(i*3)+1] === null && currentBoard[(i*3)+2] === player)
      {
        return (i*3)+1;
      }
      else if(currentBoard[i*3] === player && currentBoard[(i*3)+1] === player && currentBoard[(i*3)+2] === null)
      {
        return (i*3)+2;
      }
    }      
    

    
    //Math.floor((Math.random() * 10) + 1);

  }
  return -1;
}





export default FaucetGame;
