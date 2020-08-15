import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";
import SpotifyWebApi from "spotify-web-api-js";

export const PlaylistListItem = ({ playlist }) => (
  <div className="w-full h-24 p-3 flex flex-row items-center justify-between">
    <div className="h-full flex flex-row">
      <img
        className="h-full w-auto ml-2 object-scale-down"
        src={playlist.images[0].url}
      />
      <div className="ml-3 my-auto">
        <a
          className="no-underline hover:underline font-bold text-lg"
          href={playlist.external_urls.spotify}
          target="_blank"
          rel={"noreferrer"}
        >
          {playlist.name}
        </a>
        <div>Tracks: {playlist.tracks.total}</div>
      </div>
    </div>
    <div className="mr-3">{playlist.public ? "Public" : "Private"}</div>
  </div>
);

const PlaylistsPanel = ({ httpClient }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [playlistDetails, setPlaylistDetails] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    const asyncWrapper = async () => {
      // Fetch data from backend
      const [playlistData, r1] = await httpClient.getPlaylistList();
      const [
        spotifyAuthenticationData,
        r2,
      ] = await httpClient.getSpotifyAuthenticationData();

      // Initialize Spotify http client
      const token = spotifyAuthenticationData.access_token;
      const spotifyClient = new SpotifyWebApi();
      spotifyClient.setAccessToken(token);

      // Get playlist details from Spotify api
      const _playlistDetails = await Promise.all(
        playlistData.map((playlist) =>
          spotifyClient.getPlaylist(playlist.spotify_id, {
            fields: "external_urls,images,name,public,tracks.total",
          })
        )
      );
      setPlaylistDetails(_playlistDetails.reverse());
      setIsLoading(false);
    };
    asyncWrapper();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  } else {
    return (
      <div className="w-full flex-grow flex flex-col">
        <h2 className="mb-5">Mix Capsule History</h2>
        <div className="w-full flex-grow px-4 overflow-y-auto divide-y">
          {playlistDetails.map((playlist, i) => (
            <PlaylistListItem key={i} playlist={playlist} />
          ))}
        </div>
      </div>
    );
  }
};

PlaylistsPanel.propTypes = {
  httpClient: PropTypes.object.isRequired,
};

export default PlaylistsPanel;
