import { useState, useEffect } from "react";

export const useSpotifyAuthenticationData = (
  httpClient,
  onReady = () => {}
) => {
  const [isReady, setIsReady] = useState(false);
  const [spotifyData, setSpotifyData] = useState(null);
  useEffect(() => {
    httpClient.getSpotifyAuthenticationData().then(([data, _]) => {
      setSpotifyData(data);
      onReady(data);
      setIsReady(true);
    });
  }, []);

  return [spotifyData, isReady];
};

export const useGetPlaylistOptions = (httpClient, onReady = () => {}) => {
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
