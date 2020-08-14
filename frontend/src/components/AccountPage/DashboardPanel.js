import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Button } from "@material-ui/core";
import SpotifyWebApi from "spotify-web-api-js";

import * as constants from "../../constants";
import { generateRedirectUri } from "../../httpClients/SpotifyHttpClient";
import { useSpotifyAuthenticationData } from "../../hooks/hooks";
import { PlaylistListItem } from "./PlaylistsPanel";

/**
 * Get the full name of the next month
 * @returns {string} the name of the next month
 */
const getNextMonth = () => {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(1);
  nextMonth.setMonth(today.getMonth() + 1);
  const monthName = nextMonth.toLocaleString("default", { month: "long" });
  return monthName;
};

const DashboardPanel = ({ httpClient }) => {
  const [
    spotifyAuthenticationData,
    spotifyAuthenticationDataReady,
  ] = useSpotifyAuthenticationData(httpClient);
  let spotifyAuthRequired = null;
  if (spotifyAuthenticationDataReady) {
    spotifyAuthRequired = spotifyAuthenticationData.spotify_auth_required;
  }

  const [recentPlaylist, setRecentPlaylist] = useState(undefined);
  useEffect(() => {
    const asyncWrapper = async () => {
      // Only proceed if we have auth data
      if (
        !spotifyAuthenticationDataReady ||
        spotifyAuthenticationData.spotify_auth_required
      ) {
        return;
      }
      const [playlistData, r1] = await httpClient.getPlaylistList();
      // If the user hasn't created any playlists, set a sentinel and return
      if (playlistData.length === 0) {
        setRecentPlaylist(null);
        return;
      }

      // Initialize Spotify http client
      const token = spotifyAuthenticationData.access_token;
      const spotifyClient = new SpotifyWebApi();
      spotifyClient.setAccessToken(token);

      // Get playlist details from Spotify api
      const playlistDetails = await Promise.all(
        playlistData.map((playlist) =>
          spotifyClient.getPlaylist(playlist.spotify_id, {
            fields: "external_urls,images,name,public,tracks.total",
          })
        )
      );
      setRecentPlaylist(playlistDetails[playlistDetails.length - 1]);
    };
    asyncWrapper();
  }, [spotifyAuthenticationDataReady]);

  const [manualCreationLoading, setManualCreationLoading] = useState(false);
  const manualPlaylistCreation = () => {
    setManualCreationLoading(true);
    httpClient.createPlaylist().then(([data, response]) => {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };

  const redirectToSpotify = () => {
    // TODO: add state
    const state = "";
    window.location = generateRedirectUri(
      constants.SPOTIFY_CLIENT_ID,
      constants.REDIRECT_URI,
      constants.SCOPES,
      state
    );
  };

  if (!spotifyAuthenticationDataReady) {
    return <CircularProgress />;
  } else {
    if (spotifyAuthRequired) {
      return (
        <>
          <h2>Dashboard</h2>
          <div className="px-4">
            Before Mix Capsule can generate your playlists, you'll have to login
            with Spotify
          </div>
          <Button variant="contained" onClick={() => redirectToSpotify()}>
            Login with Spotify
          </Button>
        </>
      );
    } else {
      return (
        <>
          <h2>Dashboard</h2>
          <div className="w-full lg:h-full divide-y flex flex-col">
            <div className="w-full lg:h-full flex-shrink px-4">
              <h3 className="lg:h-full lg:flex py-4 flex-col justify-center">
                Your next playlist will be created on {getNextMonth()} 1st
              </h3>
            </div>
            <div className="w-full lg:h-full flex-shrink divide-y lg:divide-x lg:flex flex-row">
              <div className="w-full flex-shrink lg:flex flex-col">
                <h3 className="mt-3">Your most recent playlist:</h3>
                <div className="flex-grow flex flex-col justify-center items-center justify-center">
                  {recentPlaylist === undefined ? (
                    <CircularProgress />
                  ) : recentPlaylist === null ? (
                    <div className="py-4">
                      You haven't created any playlists yet
                    </div>
                  ) : (
                    <>
                      {console.log(recentPlaylist)}
                      <PlaylistListItem playlist={recentPlaylist} />
                    </>
                  )}
                </div>
              </div>
              <div className="w-full flex-shrink lg:flex flex-col">
                <h3 className="mt-3">Manual Creation</h3>
                <div className="flex-grow flex flex-col justify-center items-center">
                  <div className="mx-8 mb-6">
                    Feeling impatient? Click below to make a playlist of your
                    top tracks right now!
                  </div>
                  {manualCreationLoading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => {
                        manualPlaylistCreation();
                      }}
                    >
                      Create Playlist
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
};

DashboardPanel.propTypes = {
  httpClient: PropTypes.object,
};

export default DashboardPanel;
