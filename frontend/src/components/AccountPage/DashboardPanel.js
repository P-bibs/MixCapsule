import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Button } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import * as constants from "../../constants";
import { generateRedirectUri } from "../../httpClients/SpotifyHttpClient";
import { useHasSpotifyAuthentication } from "../../hooks/hooks";

const DashboardPanel = ({ httpClient }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({});
  useEffect(() => {
    httpClient.getUserData().then(([data, response]) => {
      console.log(data);
      setProfileData(data);
    });
  }, []);

  const [
    spotifyAuthRequired,
    spotifyAuthRequiredReady,
  ] = useHasSpotifyAuthentication(httpClient);

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

  if (!spotifyAuthRequiredReady) {
    return <CircularProgress />;
  } else {
    return (
      <div className="w-full h-full">
        Dashboard
        <h2>
          Spotify Authentication Status:{" "}
          {spotifyAuthRequired ? <CloseIcon /> : <CheckIcon />}
        </h2>
        <div>
          {spotifyAuthRequired
            ? "If you don't authenticate with Spotify, you won't have a MixCapsule playlist generated for you at the end of the month"
            : "You've successfully authenticated with Spotify, and will have a MixCapsule playlist created at the end of the month"}
        </div>
        <Button variant="contained" onClick={() => redirectToSpotify()}>
          {spotifyAuthRequired ? "RAuthenticate" : "Re-Authenticate"}
        </Button>
      </div>
    );
  }
};

DashboardPanel.propTypes = {
  httpClient: PropTypes.object,
};

export default DashboardPanel;
