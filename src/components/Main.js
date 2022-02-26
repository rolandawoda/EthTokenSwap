import React from "react";
import Identicon from "identicon.js";

import { AppContext } from "./App";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

class Main extends React.Component {
  state = {
    currentForm: "buy",
  };

  render() {
    let content = this.state.currentForm === "buy" ? <BuyForm /> : <SellForm />;
    return (
      <AppContext.Consumer>
        {({}) => {
          return (
            <div id="content" className="mt-3">
              <div className="d-flex justify-content-between mb-3">
                <button
                  className="btn btn-light"
                  onClick={(event) => {
                    this.setState({ currentForm: "buy" });
                  }}
                >
                  Buy
                </button>
                <span className="text-muted">&lt; &nbsp; &gt;</span>
                <button
                  className="btn btn-light"
                  onClick={(event) => {
                    this.setState({ currentForm: "sell" });
                  }}
                >
                  Sell
                </button>
              </div>

              <div className="card mb-4">
                <div className="card-body">{content}</div>
              </div>
            </div>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default Main;
