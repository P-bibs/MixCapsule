import React from "react";

import * as constants from "../../constants";
import "./AppPage.css";
import ApiWrapper from "../../ApiWrapper";
import { generateRedirectUri } from "../../SpotifyApiWrapper";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { CircularProgress, Button } from "@material-ui/core";

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

  componentDidMount() {
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
  }

  redirectToSpotify = () => {
    // TODO: add state
    const state = "";
    window.location = generateRedirectUri(
      constants.SPOTIFY_CLIENT_ID,
      constants.REDIRECT_URI,
      constants.SCOPES,
      state
    );
  };

  checkForAndSendSpotifyCode = () => {
    // Search for spotify access token in case we've just been redirected
    const params = new URL(window.location).searchParams;
    if (params.has("code")) {
      const spotifyCode = params.get("code");
      console.log(`found api code ${spotifyCode}. Sending backend request...`);
      this.apiWrapper
        .makeRequest("/request-spotify-tokens", { code: spotifyCode }, "POST")
        .then((response) => {
          if (response.status === 200) {
            this.setState({ hasSpotifyAuthentication: "true" });
          }
        });
    } else if (window.location.hash.includes("error")) {
      console.error(window.location.hash);
    }
  };

  handleChange = (event, fieldName) => {
    this.setState({ fieldName: event.target.value });
  };

  manualPlaylistCreation = () => {
    this.apiWrapper.makeRequest("/playlist/create").then((response) => {
      console.log(response);
    });
  };

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
            <div className="option" onClick={() => this.setState({selectedIndex: 0})}>Spotify Authentication</div>
            <div className="option" onClick={() => this.setState({selectedIndex: 1})}>Options</div>
            <div className="option" onClick={() => this.setState({selectedIndex: 2})}>Manual Creation</div>
          </div>
          <div className="main-panel">
            {this.state.isLoading ? (
              <p>
                <CircularProgress />
              </p>
            ) : this.state.selectedIndex === 0 ? (
              <>
                <h2>
                  Spotify Authentication Status:{" "}
                  {this.state.hasSpotifyAuthentication === "true" ? (
                    <CheckIcon />
                  ) : (
                    <CloseIcon />
                  )}
                </h2>
                <p>
                  {this.state.hasSpotifyAuthentication === "true"
                    ? "You've successfully authenticated with Spotify, and will have a MixCapsule playlist created at the end of the month"
                    : "If you don't authenticate with Spotify, you won't have a MixCapsule playlist generated for you at the end of the month"}
                </p>
                <Button variant="contained" onClick={() => this.redirectToSpotify()}>
                  {this.state.hasSpotifyAuthentication === "true"
                    ? "Re-Authenticate"
                    : "Authenticate"}
                </Button>
              </>
            ) : this.state.selectedIndex === 1 ? (
              <>
                <h2>MixCapsule Options</h2>
                <div>Number of Songs: </div>
                <input
                  onChange={(e) => {
                    this.handleChange(e, "numSongs");
                  }}
                  value={this.state.numSongs}
                />
                <br />

                <Button variant="contained" onClick={() => {}}>Apply</Button>
              </>
            ) : (
              <Button variant="contained"
                onClick={() => {
                  this.manualPlaylistCreation();
                }}
              >
                Trigger Manual Creation
              </Button>
            )}
          </div>
        </div>
        <div className="footer"></div>
      </div>
    );
  }
}
