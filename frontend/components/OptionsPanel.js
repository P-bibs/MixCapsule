import React, { useState, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import {
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import { toast } from "react-toastify";

const OPTION_FIELDS = {
  NUMBER_SONGS: "NUMBER_SONGS",
  HISTORY_DURATION: "HISTORY_DURATION",
};

const OptionsPanel = ({ httpClient }) => {
  const objectReducer = (state, newState) => ({ ...state, ...newState });
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useReducer(objectReducer, {});
  const [validationErrors, setValidationErrors] = useReducer(objectReducer, {
    number_songs: false,
    history_duration: false,
  });

  useEffect(() => {
    setIsLoading(true);
    httpClient.getOptions().then(([data, response]) => {
      setOptions(data);
      setIsLoading(false);
    });
  }, []);

  const handleChange = (event, target) => {
    if (target === OPTION_FIELDS.NUMBER_SONGS) {
      const withoutInvalidCharacters = event.target.value.replace(
        /[^0-9]/g,
        ""
      );
      setOptions({
        number_songs: withoutInvalidCharacters,
      });
    } else if (target === OPTION_FIELDS.HISTORY_DURATION) {
      setOptions({
        history_duration: event.target.value,
      });
    }
  };

  /**
   * Validates form fields
   * @returns {boolean} true if no errors, false otherwise
   */
  const validateOptions = () => {
    const numberSongsError = !(
      !isNaN(parseInt(options.number_songs)) &&
      options.number_songs > 0 &&
      options.number_songs <= 50
    );

    const historyDurationError = ![
      "short_term",
      "medium_term",
      "long_term",
    ].includes(options.history_duration);

    setValidationErrors({
      number_songs: numberSongsError,
      history_duration: historyDurationError,
    });

    return !(numberSongsError || historyDurationError);
  };

  const saveOptions = () => {
    if (!validateOptions()) {
      return;
    }
    httpClient.updateOptions(options).then(([data, response]) => {
      if (response.status === 200) {
        toast("Preferences updated successfully!");
      } else {
        toast("Uh-oh, an error occurred!");
      }
    });
  };

  return (
    <div className="w-full flex-grow flex flex-col">
      <h2>MixCapsule Options</h2>
      {isLoading ? (
        <CircularProgress className="w-full m-auto" />
      ) : (
        <div className="w-full my-auto flex-grow flex flex-col items-center justify-center">
          <div className="h-24 text-center">
            <div className="mb-2">Number of Songs: </div>
            <input
              onChange={(e) => {
                handleChange(e, OPTION_FIELDS.NUMBER_SONGS);
              }}
              className="w-24 py-2 px-3 shadow appearance-none text-center border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={options.number_songs}
            />
            {validationErrors.number_songs && (
              <div className="text-sm text-red-600">
                Must be a number from 1 to 50
              </div>
            )}
          </div>
          <div className="h-24 mt-8">
            <FormControl variant="outlined" className="w-32">
              <InputLabel>History Duration</InputLabel>
              <Select
                native
                value={options.history_duration}
                onChange={(event) =>
                  handleChange(event, OPTION_FIELDS.HISTORY_DURATION)
                }
                inputProps={{
                  name: "History Duration",
                }}
                label="History Duration"
              >
                <option value={"short_term"}>4 weeks</option>
                <option value={"medium_term"}>6 months</option>
                <option value={"long_term"}>All time</option>
              </Select>
            </FormControl>
            {validationErrors.history_duration && (
              <div className="text-sm text-red-600">Error</div>
            )}
          </div>
          <br />

          <Button variant="contained" onClick={() => saveOptions()}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
};

OptionsPanel.propTypes = {
  httpClient: PropTypes.object.isRequired,
};

export default OptionsPanel;
