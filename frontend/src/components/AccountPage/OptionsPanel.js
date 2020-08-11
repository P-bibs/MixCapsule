import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import { useGetPlaylistOptions } from "../../hooks/hooks";

const OptionsPanel = ({ httpClient }) => {
  const [editedOptions, setEditedOptions] = useState({});

  const [options, optionsReady] = useGetPlaylistOptions(httpClient, (options) =>
    setEditedOptions(options)
  );

  const handleChange = (event, target) => {
    if (target === "numberSongs") {
      const withoutInvalidCharacters = event.target.replace(/[^0-9]/g, "");
      setEditedOptions((state) => ({
        ...state,
        number_songs: withoutInvalidCharacters,
      }));
    } else if (target === "historyDuration") {
      setEditedOptions((state) => ({
        ...state,
        history_duration: event.target.value,
      }));
    }
  };

  const saveOptions = () => {
    httpClient.updateOptions(editedOptions).then(([data, response]) => {
      console.log(data);
    });
  };

  if (!optionsReady) {
    return <CircularProgress />;
  } else {
    return (
      <div id="OptionsPanel" className="flex flex-col items-center">
        <h1>MixCapsule Options</h1>
        <div>Number of Songs: </div>
        <input
          onChange={(e) => {
            handleChange(e, "number_songs");
          }}
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={editedOptions.number_songs}
        />
        <div className="mt-8">
          <FormControl variant="outlined" className="w-32">
            <InputLabel>History Duration</InputLabel>
            <Select
              native
              value={editedOptions.history_duration}
              onChange={(event) => handleChange(event, "history_duration")}
              inputProps={{
                name: "History Duration",
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

        <Button variant="contained" onClick={() => saveOptions()}>
          Apply
        </Button>
      </div>
    );
  }
};

OptionsPanel.propTypes = {
  httpClient: PropTypes.object.isRequired,
};

export default OptionsPanel;
