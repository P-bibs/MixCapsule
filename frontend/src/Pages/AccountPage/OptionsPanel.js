import React from "react";
import {
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";

export default class OptionsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.apiWrapper = props.apiWrapper;
    this.state = {
      isLoading: true,
      // numberSongs:
    };
  }

  componentDidMount() {
    this.apiWrapper
      .makeRequest("/playlist/options/")
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
        <div className="OptionsPanel">
          <h2>MixCapsule Options</h2>
          <div>Number of Songs: </div>
          <input
            onChange={(e) => {
              this.handleChange(e, "numSongs");
            }}
            value={this.state.numSongs}
          />
          <div className="option">
            <FormControl className="">
              <InputLabel>History Duration</InputLabel>
              <Select
                native
                value={this.state.historyDuration}
                onChange={(event) => this.handleChange(event)}
                inputProps={{
                  name: "age",
                }}
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
