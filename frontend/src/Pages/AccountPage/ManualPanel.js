import React from "react";
import { CircularProgress, Button } from "@material-ui/core";

export default class ManualPanel extends React.Component {
  constructor(props) {
    super(props);
    this.apiWrapper = props.apiWrapper
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {}

  manualPlaylistCreation = () => {
    this.apiWrapper
      .makeAuthenticatedRequest("/playlist/", "POST", {})
      .then(([data, response]) => {
        console.log(response);
      });
  };

  render() {
    if (this.state.isLoading) {
      return <CircularProgress />;
    } else {
      return (
        <Button
          variant="contained"
          onClick={() => {
            this.manualPlaylistCreation();
          }}
        >
          Trigger Manual Creation
        </Button>
      );
    }
  }
}
