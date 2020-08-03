import React from "react";
import {
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import "./OptionsPanel.css";

export default class OptionsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.httpClient = props.httpClient;
    this.state = {
      isLoading: true,
      // numberSongs:
    };
  }

  componentDidMount() {
    this.httpClient
      .makeAuthenticatedRequest("/playlist/options/")
      .then(([data, response]) => {
        this.setState({
          numberSongs: data["number_songs"],
          isLoading: false,
        });
      });
  }

  handleChange(event) {
    if (event.target.name === "numberSongs") {
      const withoutInvalidCharacters = event.target.replace(/[^0-9]/g, "");
      this.setState({
        numberSongs: withoutInvalidCharacters,
      });
    } else if (event.target.name === "historyDuration") {
      this.setState({
        historyDuration: event.target.value,
      });
    }
  }

  render() {
    if (this.state.isLoading) {
      return <CircularProgress />;
    } else {
      return (
        <div className="options-panel">
          <h1>MixCapsule Options</h1>
          <div>Number of Songs: </div>
          <input
            onChange={(e) => {
              this.handleChange(e, "numSongs");
            }}
            value={this.state.numSongs}
          />
          <div className="dropdown">
            <FormControl variant="outlined" className="form-control">
              <InputLabel>History Duration</InputLabel>
              <Select
                native
                value={this.state.historyDuration}
                onChange={(event) => this.handleChange(event)}
                inputProps={{
                  name: "age",
                }}
                label="History Duration"
              >
                <option value={"short"}>4 weeks</option>
                <option value={"medium"}>6 months</option>
                <option value={"long"}>All time</option>
              </Select>
            </FormControl>
          </div>
          <br />

          <Button variant="contained" onClick={() => {}}>
            Apply
          </Button>
        </div>
      );
    }
  }
}
