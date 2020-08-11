import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";
import { useHasSpotifyAuthentication } from "../../hooks/hooks";

const ListItem = ({ children }) => (
  <div className="w-48 h-12 bg-gray-500 m-3">{children}</div>
);

const PlaylistsPanel = ({ httpClient }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [playlistData, setPlaylistData] = useState([]);
  useEffect(() => {
    httpClient.getPlaylistList().then(([data, response]) => {
      console.log(data);
      setPlaylistData(data);
      setIsLoading(false);
    });
  }, []);

  const [
    spotifyAuthRequired,
    spotifyAuthRequiredReady,
  ] = useHasSpotifyAuthentication(httpClient);

  if (isLoading || !spotifyAuthRequiredReady) {
    return <CircularProgress />;
  } else if (spotifyAuthRequired === true) {
    return <div>Please authenticate with Spotify</div>;
  } else {
    return (
      <>
        {playlistData.map((playlist, i) => (
          <ListItem key={i}>{playlist.spotify_id}</ListItem>
        ))}
      </>
    );
  }
};

PlaylistsPanel.propTypes = {
  httpClient: PropTypes.object.isRequired,
};

export default PlaylistsPanel;
