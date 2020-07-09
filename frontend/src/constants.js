const DEBUG = true;
const API_PATH = DEBUG
  ? "http://localhost:8000"
  : "https://api.mixcapsule.paulbiberstein.me";
const APP_PATH = DEBUG
  ? "http://localhost:3000"
  : "https://mixcapsule.paulbiberstein.me"

export {DEBUG, API_PATH, APP_PATH}