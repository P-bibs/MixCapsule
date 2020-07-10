import React from "react";

import * as constants from "../../constants";
import "./AppPage.css";
import ApiWrapper from "../../ApiWrapper";
import { generateRedirectUri } from "../../SpotifyApiWrapper";

export default class AppPage extends React.Component {
  constructor(props) {
    super(props);
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
    this.apiWrapper = new ApiWrapper(refreshToken, accessToken);
    this.state = {
      selectedIndex: 0,
      isLoading: false,
      hasSpotifyAuthentication: "test",
    };

    this.this.checkForAndSendSpotifyCode();
  }

  componentDidMount() {
    this.spotifyAuthenticationPanel();
  }

  redirectToSpotify = () => {
    // TODO: add state
    let state = "";
    window.location = generateRedirectUri(
      constants.SPOTIFY_CLIENT_ID,
      constants.REDIRECT_URI,
      constants.SCOPES,
      state
    );
  };

  checkForAndSendSpotifyCode = () => {
    // Search for spotify access token in case we've just been redirected
    if (window.location.hash.includes("code")) {
      const hashFragment = window.location.hash.substr(1);
      let spotifyCode;
      try {
        spotifyCode = hashFragment.split("&")[0].split("=")[1];
      } catch {
        return;
      }
      this.apiWrapper
        .makeRequest("/requestSpotifyTokens", { code: spotifyCode }, "POST")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });
    } else if (window.location.hash.includes("error")) {
      console.error(window.location.hash);
    }
  };

  spotifyAuthenticationPanel = () => {
    if (this.state.hasSpotifyAuthentication === "test") {
      this.setState({ isLoading: true });
      this.apiWrapper
        .makeRequest("/has-spotify-authentication")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.setState({
            isLoading: false,
            hasSpotifyAuthentication: data.toString(),
          });
        });
    } else {
    }
  };

  optionsPanel = () => {};
  manualCreationPanel = () => {};

  render() {
    return (
      <div className="app-page">
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
          <div className="main-panel">
            {this.state.isLoading ? (
              <p>Loading...</p>
            ) : this.state.selectedIndex === 0 ? (
              <>
                <p>
                  Has spotify authentication:
                  {" " + this.state.hasSpotifyAuthentication}
                </p>
                <button onClick={() => this.redirectToSpotify()}>
                  Authenticate
                </button>
              </>
            ) : this.state.selectedIndex === 1 ? (
              <>
                <div>Number of Songs: </div>
                <input onChange={() => {}} />
              </>
            ) : (
              <button onClick={() => {}}>Trigger Manual Creation</button>
            )}
          </div>
        </div>
        <div className="footer"></div>
      </div>
    );
  }
}
