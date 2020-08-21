import React from "react";
import { CircularProgress } from "@material-ui/core";
import { ToastContainer } from "react-toastify";

import MixCapsuleHttpClient from "../../httpClients/MixCapsuleHttpClient";
import PlaylistsPanel from "./PlaylistsPanel";
import OptionsPanel from "./OptionsPanel";
import ManualPanel from "./ManualPanel";
import DashboardPanel from "./DashboardPanel";
import { Header, Footer } from "../common";

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

const PanelSwitcher = ({ selectedIndex, setSelectedIndex }) => {
  const panels = ["Dashboard", "Playlists", "Options", "Manual Creation"];
  return (
    <div className="w-full bg-fourth rounded-t overflow-x-auto flex flex-row justify-center">
      {panels.map((panelName, i) => (
        <DrawerItem
          key={i}
          active={selectedIndex === i}
          onClick={() => setSelectedIndex(i)}
        >
          {panelName}
        </DrawerItem>
      ))}
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
    const url = new URL(window.location);
    if (url.pathname !== "/app/redirect") {
      return;
    }
    this.state = { ...this.state, selectedIndex: -1 };
    const params = url.searchParams;
    if (params.has("code")) {
      const spotifyCode = params.get("code");
      console.log(`found api code ${spotifyCode}. Sending backend request...`);
      MixCapsuleHttpClient.requestToken(spotifyCode).then(
        ([data, response]) => {
          console.log("Successfully POSTed spotify auth");
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          if (response.status === 200) {
            console.log("redirecting without code");
            window.location.href = "/app";
          }
        }
      );
    } else if (window.location.hash.includes("error")) {
      console.error(window.location.hash);
    }
  };

  componentDidMount() {}

  render() {
    return (
      <div
        id="AppPage"
        className="min-h-screen lg:h-screen w-full m-0 p-0 bg-second flex flex-col justify-between"
      >
        <Header />
        <div className="w-full flex-grow relative flex flex-col items-center">
          <svg
            className="w-full  absolute bottom-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 500"
          >
            <path
              d="M0,500c59.15-20.86,131.14-53.75,166.67-102.91,47.82-66.19,2.12-123.93,42.88-133C266.43,251.5,373.3,360,455.88,348.18c60.74-8.66,78-78.05,96.77-153.85,23.22-93.59,2.4-125,46.18-139,83.1-26.6,236.32,61.45,335.4,34.07,51.27-14.17,65-52.86,66.47-89.4V500Z"
              style={{
                fill: "#1a202c",
                stroke: "#1a202c",
                strokeMiterlimit: 10,
              }}
            />
          </svg>
          <div
            id="body"
            className="w-11/12 lg:w-2/3 flex-grow my-6 lg:my-12 bg-first self-center rounded shadow-lg relative flex flex-col items-center justify-center"
          >
            <PanelSwitcher
              selectedIndex={this.state.selectedIndex}
              setSelectedIndex={(x) => this.setState({ selectedIndex: x })}
            />
            <div className="w-full m-8 mb-0 flex-grow flex flex-col items-center justify-center">
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
        </div>
        <Footer />
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          limit={1}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }
}
