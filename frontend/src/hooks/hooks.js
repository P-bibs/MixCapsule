import { useState, useEffect } from "react";

const useHasSpotifyAuthentication = (httpClient, onReady = () => {}) => {
  const [isReady, setIsReady] = useState(false);
  const [spotifyAuthRequired, setSpotifyAuthRequired] = useState(null);
  useEffect(() => {
    httpClient.getSpotifyAuthenticationData().then(([data, _]) => {
      console.log(data);
      const authRequired = data["spotify_auth_required"];
      setSpotifyAuthRequired(authRequired);
      onReady(authRequired);
      setIsReady(true);
    });
  }, []);

  return [spotifyAuthRequired, isReady];
};

const useGetPlaylistOptions = (httpClient, onReady) => {
  const [isReady, setIsReady] = useState(false);
  const [options, setOptions] = useState(null);
  useEffect(() => {
    httpClient.getOptions().then(([data, response]) => {
      setOptions(data);
      onReady(data);
      setIsReady(true);
    });
  }, []);

  return [options, isReady];
};

export { useHasSpotifyAuthentication, useGetPlaylistOptions };
