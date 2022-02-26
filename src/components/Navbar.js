import React from "react";
import Identicon from "identicon.js";

import { AppContext } from "./App";

class Navbar extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ userAccount  }) => {
          return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
              <a
                className="navbar-brand col-sm-3 col-md-2 mr-0"
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                EthSwap
              </a>
              <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap d-none d-sm-block ">
                  <small className="text-secondary ">
                    <small id="account">{userAccount}</small>
                  </small>
                  {userAccount && (
                    <img
                      className="ml-2"
                      width={30}
                      height={30}
                      alt=""
                      src={`data:image/png;base64,${new Identicon(
                        userAccount,
                        30
                      ).toString()}`}
                    />
                  )}
                </li>
              </ul>
            </nav>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default Navbar;
