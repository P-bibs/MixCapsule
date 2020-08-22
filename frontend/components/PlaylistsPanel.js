import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";
import { IoIosTrash } from "react-icons/io";
import SpotifyWebApi from "spotify-web-api-js";

export const PlaylistListItem = ({ playlist, deletePlaylist }) => (
  <div className="w-full h-24 p-3 flex flex-row items-center justify-between">
    <div className="h-full flex flex-row">
      <img
        className="h-full w-auto ml-2 object-scale-down"
        src={playlist.images[0].url}
      />
      <div className="ml-3 my-auto">
        <a
          className="font-bold text-lg"
          href={playlist.external_urls.spotify}
          target="_blank"
          rel={"noreferrer"}
        >
          {playlist.name}
        </a>
        <div>Tracks: {playlist.tracks.total}</div>
      </div>
    </div>
    <div className="mr-3 flex flex-col items-end">
      <div className="">{playlist.public ? "Public" : "Private"}</div>
      <IoIosTrash className="cursor-pointer" onClick={deletePlaylist} />
    </div>
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
            fields: "external_urls,images,name,public,tracks.total,id",
          })
        )
      );
      setPlaylistDetails(_playlistDetails.reverse());
      setIsLoading(false);
    };
    asyncWrapper();
  }, []);

  const deletePlaylist = (id) => {
    httpClient.deletePlaylist(id).then(([_, response]) => {
      if (response.status === 200) {
        // If we delete the playlist from the database, delete it on the frontend too
        setPlaylistDetails((state) =>
          state.filter((playlist) => playlist.id !== id)
        );
      }
    });
  };

  return (
    <div className="w-full flex-grow flex flex-col">
      <h2 className="mb-5">Mix Capsule History</h2>
      {isLoading ? (
        <CircularProgress className="w-full m-auto" />
      ) : (
        <div className="w-full flex-grow px-4 overflow-y-auto divide-y">
          {playlistDetails.map((playlist, i) => (
            <PlaylistListItem
              key={i}
              playlist={playlist}
              deletePlaylist={() => deletePlaylist(playlist.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

PlaylistsPanel.propTypes = {
  httpClient: PropTypes.object.isRequired,
};

export default PlaylistsPanel;
