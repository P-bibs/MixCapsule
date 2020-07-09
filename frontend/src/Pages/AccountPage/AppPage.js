import React from "react";

import { DEBUG, API_PATH, APP_PATH } from "../../constants";
import "./AppPage.css";

export default class AppPage extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('access_token');
    fetch(API_PATH)
  }

  this.spotifyAuthenticationPanel = (
    <>
      <div></div>
    </>
  )
  this.optionsPanel = <></>
  this.manualCreationPanel = <></>

  render() {
    return (
      <body>
        <div className="header">
          <div className="product-name header-item" href="/">
            <a className="home-link" href="/MixCapsule">
              MixCapsule
            </a>
          </div>
          <div id="gLogin1" className="header-item"></div>
        </div>
        <div className="app-page-body">
          <div className="sidebar">
            <div className="option">Spotify Authentication</div>
            <div className="option">Options</div>
            <div className="option">Manual Creation</div>
          </div>
          <div className="main-panel"></div>
        </div>
        <div className="footer"></div>
      </body>
    );
  }
}
