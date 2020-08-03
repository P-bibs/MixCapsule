import React from "react";
import { CircularProgress } from "@material-ui/core";

import * as constants from "../../constants";
import MixCapsuleHttpClient from "../../httpClients/MixCapsuleHttpClient";
import SpotifyPanel from "./SpotifyPanel";
import OptionsPanel from "./OptionsPanel";
import ManualPanel from "./ManualPanel";

export default class AppPage extends React.Component {
  constructor(props) {
    super(props);
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
    this.httpClient = new MixCapsuleHttpClient(refreshToken, accessToken);
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
      this.httpClient
        .makeAuthenticatedRequest("/spotify/authentication/", "POST", {
          code: spotifyCode,
        })
        .then(([_, response]) => {
          console.log("Successfully POSTed spotify auth");
          if (response.status === 200) {
            console.log("redirecting without code");
            window.location.href = "/app";
          }
        });
    } else if (window.location.hash.includes("error")) {
      console.error(window.location.hash);
    }
  };

  componentDidMount() {}

  render() {
    return (
      <div id="AppPage" className="h-screen m-0 p-0 flex flex-col">
        <div className="header">
          <div className="product-name header-item" href="/">
            <a className="home-link" href="/">
              MixCapsule
            </a>
          </div>
          <div id="gLogin1" className="header-item"></div>
        </div>
        <div className="h-full w-2/5 self-center flex flex-row items-center justify-center">
          <div className="border-r border-black">
            <div
              className="m-3 p-2 border border-black cursor-pointer hover:bg-gray-500"
              onClick={() => this.setState({ selectedIndex: 0 })}
            >
              Spotify Authentication
            </div>
            <div
              className="m-3 p-2 border border-black cursor-pointer hover:bg-gray-500"
              onClick={() => this.setState({ selectedIndex: 1 })}
            >
              Options
            </div>
            <div
              className="m-3 p-2 border border-black cursor-pointer hover:bg-gray-500"
              onClick={() => this.setState({ selectedIndex: 2 })}
            >
              Manual Creation
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full m-8">
            {this.state.isLoading && (
              <div>
                <CircularProgress />
              </div>
            )}
            {this.state.selectedIndex === 0 && (
              <SpotifyPanel httpClient={this.httpClient} />
            )}
            {this.state.selectedIndex === 1 && (
              <OptionsPanel httpClient={this.httpClient} />
            )}
            {this.state.selectedIndex === 2 && (
              <ManualPanel httpClient={this.httpClient} />
            )}
          </div>
        </div>
        <div className="footer"></div>
      </div>
    );
  }
}
