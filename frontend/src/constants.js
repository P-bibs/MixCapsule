export const DEBUG = process.env.NODE_ENV === "development";
export const API_PATH = DEBUG
  ? "http://localhost:8000"
  : "https://api.mixcapsule.paulbiberstein.me";
export const APP_PATH = DEBUG
  ? "http://localhost:3000"
  : "https://mixcapsule.paulbiberstein.me";

export const SPOTIFY_CLIENT_ID = "d4027e74192f44a3a96139dc6d941b9c";
export const REDIRECT_URI = `${APP_PATH}/app`;
export const SCOPES =
  "user-top-read user-read-recently-played playlist-modify-private";
