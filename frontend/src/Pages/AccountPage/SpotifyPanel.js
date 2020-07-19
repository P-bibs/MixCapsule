import React from "react";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { CircularProgress, Button } from "@material-ui/core";

export default class SpotifyPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {}

  render() {
    if (this.state.isLoading) {
      return <CircularProgress />;
    } else {
      return (
        <>
          <h2>
            Spotify Authentication Status:{" "}
            {this.state.hasSpotifyAuthentication ? <CheckIcon /> : <CloseIcon />}
          </h2>
          <div>
            {this.state.hasSpotifyAuthentication
              ? "You've successfully authenticated with Spotify, and will have a MixCapsule playlist created at the end of the month"
              : "If you don't authenticate with Spotify, you won't have a MixCapsule playlist generated for you at the end of the month"}
          </div>
          <Button variant="contained" onClick={() => this.redirectToSpotify()}>
            {this.state.hasSpotifyAuthentication
              ? "Re-Authenticate"
              : "Authenticate"}
          </Button>
        </>
      );
    }
  }
}
