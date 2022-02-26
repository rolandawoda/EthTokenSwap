pragma solidity ^0.5.0;

import './Token.sol';

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100;

    event TokenPurchased (
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokenSold (
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token ) public {
        token = _token; 
    }

    function buyTokens() public  payable {
        // Redemption  Rate = # of tokens buyer receives for 1 ether
        //Amount of Ethereuw * Redemption Rate
        uint tokenAmount = msg.value * rate; 
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);

        //Emit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellToken (uint _amount) public {
        //Users can't sell more token than they have
        require(token.balanceOf(msg.sender) >= _amount );
        //Calculate the amount of ether to redemm
        uint etherAmount = _amount / rate;

        //Require that EthSwap has enough Ether
        require(address(this).balance >= etherAmount);

        //Perform Sale
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        //Emit event on succesfull purchase;
        emit TokenSold(msg.sender, address(token), _amount, rate);
    }
     

}