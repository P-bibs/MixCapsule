import React from "react";
import { CircularProgress } from "@material-ui/core";
import { IoLogoGithub } from "react-icons/io";

import * as constants from "../../constants";
import MixCapsuleHttpClient from "../../httpClients/MixCapsuleHttpClient";
import PlaylistsPanel from "./PlaylistsPanel";
import OptionsPanel from "./OptionsPanel";
import ManualPanel from "./ManualPanel";
import DashboardPanel from "./DashboardPanel";

const DrawerItem = ({ onClick, children, active }) => {
  return (
    <div
      className={
        "mt-2 mb-0 mx-0 p-2 pb-0 text-white border-b-2 border-gray-300 rounded-t-sm cursor-pointer hover:bg-gray-500 hover:border-gray-400" +
        (active ? " bg-gray-600 border-gray-500" : "")
      }
      onClick={onClick}
    >
      {" "}
      {children}{" "}
    </div>
  );
};

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
        .sendSpotifyAuthenticationData(spotifyCode)
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
      <div id="AppPage" className="h-screen w-full m-0 p-0 flex flex-col">
        <div
          id="header"
          className="m-0 p-0 bg-purple-900 shadow sticky top-0 flex flex-row items-center justify-between"
        >
          <div className="text-purple-400 m-3" href="/">
            <a href="/" className="no-underline">
              Mix Capsule
            </a>
          </div>
        </div>
        <div
          id="body"
          className="w-2/3 h-px flex-grow my-12 self-center card flex flex-col items-center justify-center"
        >
          <div className="w-full bg-gray-700 rounded-t overflow-x-auto flex flex-row justify-center">
            <DrawerItem
              active={this.state.selectedIndex === 0}
              onClick={() =>
                this.setState({
                  selectedIndex: 0,
                })
              }
            >
              Dashboard
            </DrawerItem>
            <DrawerItem
              active={this.state.selectedIndex === 1}
              onClick={() =>
                this.setState({
                  selectedIndex: 1,
                })
              }
            >
              Playlists
            </DrawerItem>
            <DrawerItem
              active={this.state.selectedIndex === 2}
              onClick={() =>
                this.setState({
                  selectedIndex: 2,
                })
              }
            >
              Options
            </DrawerItem>
            <DrawerItem
              active={this.state.selectedIndex === 3}
              onClick={() =>
                this.setState({
                  selectedIndex: 3,
                })
              }
            >
              Manual Creation
            </DrawerItem>
          </div>
          <div className="w-full m-8 flex-grow flex flex-col items-center justify-center">
            {this.state.isLoading && (
              <div>
                <CircularProgress />
              </div>
            )}
            {this.state.selectedIndex === 0 && (
              <DashboardPanel httpClient={this.httpClient} />
            )}
            {this.state.selectedIndex === 1 && (
              <PlaylistsPanel httpClient={this.httpClient} />
            )}
            {this.state.selectedIndex === 2 && (
              <OptionsPanel httpClient={this.httpClient} />
            )}
            {this.state.selectedIndex === 3 && (
              <ManualPanel httpClient={this.httpClient} />
            )}
          </div>
        </div>
        <div
          id="footer"
          className="w-full py-4 text-white bg-purple-900 flex flex-row items-center justify-between"
        >
          <div className="mx-4">
            Made by{" "}
            <a className="underline" href="https://paulbiberstein.me/">
              Paul Biberstein
            </a>
          </div>
          <a href="https://github.com/P-bibs/MixCapsule" className="mx-4">
            <IoLogoGithub />
          </a>
        </div>
      </div>
    );
  }
}
