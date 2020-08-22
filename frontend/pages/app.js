import React, { useEffect, useState } from "react";
import Head from "next/head";
import { CircularProgress, useForkRef } from "@material-ui/core";
import { ToastContainer } from "react-toastify";

import MixCapsuleHttpClient from "../httpClients/MixCapsuleHttpClient";
import PlaylistsPanel from "../components/PlaylistsPanel";
import OptionsPanel from "../components/OptionsPanel";
import ManualPanel from "../components/ManualPanel";
import DashboardPanel from "../components/DashboardPanel";
import { Header, Footer } from "../components/common";

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

const AppPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [httpClient, setHttpClient] = useState();
  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
    setHttpClient(new MixCapsuleHttpClient(refreshToken, accessToken));
    setIsLoading(false);
  }, []);

  return (
    <div
      id="AppPage"
      className="min-h-screen lg:h-screen w-full m-0 p-0 bg-second flex flex-col justify-between"
    >
      <Head>
        <title>Mix Capsule</title>
      </Head>
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
            selectedIndex={selectedIndex}
            setSelectedIndex={(x) => setSelectedIndex(x)}
          />
          <div className="w-full m-8 mb-0 flex-grow flex flex-col items-center justify-center">
            {isLoading ? (
              <div>
                <CircularProgress />
              </div>
            ) : selectedIndex === 0 ? (
              <DashboardPanel httpClient={httpClient} />
            ) : selectedIndex === 1 ? (
              <PlaylistsPanel httpClient={httpClient} />
            ) : selectedIndex === 2 ? (
              <OptionsPanel httpClient={httpClient} />
            ) : selectedIndex === 3 ? (
              <ManualPanel httpClient={httpClient} />
            ) : (
              ""
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
};

export default AppPage;
