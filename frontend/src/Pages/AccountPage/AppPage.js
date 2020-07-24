import React from "react";

import * as constants from "../../constants";
import "./AppPage.css";
import ApiWrapper from "../../ApiWrapper";
import { CircularProgress } from "@material-ui/core";
import SpotifyPanel from "./SpotifyPanel";
import OptionsPanel from "./OptionsPanel";
import ManualPanel from "./ManualPanel";

export default class AppPage extends React.Component {
  constructor(props) {
    super(props);
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
    this.apiWrapper = new ApiWrapper(refreshToken, accessToken);
    this.state = {
      selectedIndex: 0,
      isLoading: false,
      hasSpotifyAuthentication: null,
      numSongs: null,
    };

    this.checkForAndSendSpotifyCode();
  }

  checkForAndSendSpotifyCode = () => {
    // Search for spotify access token in case we've just been redirected
    const params = new URL(window.location).searchParams;
    if (params.has("code")) {
      const spotifyCode = params.get("code");
      console.log(`found api code ${spotifyCode}. Sending backend request...`);
      this.apiWrapper
        .makeAuthenticatedRequest("/spotify/authentication/", "POST", { code: spotifyCode })
        .then(([_, response]) => {
          console.log("Successfully POSTed spotify auth")
          if (response.status === 200) {
            console.log("redirecting without code")
            window.location.href = "/app"
          }
        });
    } else if (window.location.hash.includes("error")) {
      console.error(window.location.hash);
    }
  };

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="app-page">
        <div className="header">
          <div className="product-name header-item" href="/">
            <a className="home-link" href="/">
              MixCapsule
            </a>
          </div>
          <div id="gLogin1" className="header-item"></div>
        </div>
        <div className="app-page-body">
          <div className="sidebar">
            <div
              className="option"
              onClick={() => this.setState({ selectedIndex: 0 })}
            >
              Spotify Authentication
            </div>
            <div
              className="option"
              onClick={() => this.setState({ selectedIndex: 1 })}
            >
              Options
            </div>
            <div
              className="option"
              onClick={() => this.setState({ selectedIndex: 2 })}
            >
              Manual Creation
            </div>
          </div>
          <div className="main-panel">
            {this.state.isLoading && (
              <div>
                <CircularProgress />
              </div>
            )}
            {this.state.selectedIndex === 0 && (
              <SpotifyPanel apiWrapper={this.apiWrapper} />
            )}
            {this.state.selectedIndex === 1 && (
              <OptionsPanel apiWrapper={this.apiWrapper} />
            )}
            {this.state.selectedIndex === 2 && (
              <ManualPanel apiWrapper={this.apiWrapper} />
            )}
          </div>
        </div>
        <div className="footer"></div>
      </div>
    );
  }
}
