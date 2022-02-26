import React, { Component } from "react";
import Web3 from "web3";

import logo from "../logo.png";
import "./App.css";

//Contracts ABI
import EthSwap from "../abis/EthSwap.json";
import Token from "../abis/Token.json";

//Components
import Navbar from "./Navbar";
import Main from "./Main";

export const AppContext = React.createContext({
  userAccount: null,
  web3: null,
  ethereum: null,
  ethBalance: 0,
  token: null,
  ethSwap: null,
  tokenBalance: 0,
  buyTokens: () => {},
  sellTokens: () => {},
});

class App extends Component {
  state = {
    userAccount: null,
    ethereum: null,
    ethBalance: 0,
    token: null,
    ethSwap: null,
    tokenBalance: 0,
    loading: true,
    web3: null,
  };

  async componentDidMount() {
    await this._loadWeb3();
    await this._loadBlockChainData();
  }

  _loadBlockChainData = async () => {
    if (!Boolean(this.state.ethereum)) return;
    const web3 = new Web3(this.state.ethereum);
    const ethBalance = await web3.eth.getBalance(this.state.userAccount);
    this.setState({ ethBalance, web3 });

    //Load Token
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      let tokenBalance = await token.methods
        .balanceOf(this.state.userAccount)
        .call();
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      window.alert("Token contract not deployed to detected network");
    }

    //Load Token
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
    } else {
      window.alert("EthSwap contract not deployed to detected network");
    }

    this.setState({ loading: false });
  };

  _loadWeb3 = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      this.setState({
        userAccount: accounts[0],
        ethereum: ethereum,
      });
    } else {
      window.alert(
        "Non-Ethereum browser detected. you should consider trying Metamask!"
      );
    }
  };

  _buyTokens = async (etherAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods
      .buyTokens()
      .send({ from: this.state.userAccount, value: etherAmount })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  }; 

  _sellTokens = async (_tokenAmount) => {
    this.setState({loading: true});
    this.state.token.methods
      .approve(this.state.ethSwap.address, _tokenAmount)
      .send({ from: this.state.userAccount })
      .on("transactionHash", (hash) => {
        this.state.ethSwap.methods
          .sellToken(_tokenAmount)
          .send({ from: this.state.userAccount })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  render() {
    const {
      userAccount,
      ethereum,
      ethBalance,
      web3,
      tokenBalance,
    } = this.state;
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      content = <Main />;
    }
    return (
      <AppContext.Provider
        value={{
          userAccount,
          ethereum,
          ethBalance,
          web3,
          tokenBalance,
          buyTokens: this._buyTokens,
          sellTokens: this._sellTokens,
        }}
      >
        <div>
          <Navbar />
          <div className="container-fluid mt-5">
            <div className="row">
              <main
                role="main"
                className="col-lg-12 ml-auto mr-auto"
                style={{ maxWidth: "600px" }}
              >
                <div className="content mr-auto ml-auto">{content}</div>
              </main>
            </div>
          </div>
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;
