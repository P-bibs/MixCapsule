import React from "react";
import { CircularProgress, Button } from "@material-ui/core";

export default class ManualPanel extends React.Component {
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
