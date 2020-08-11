import React, { useState } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Button } from "@material-ui/core";

const ManualPanel = ({ httpClient }) => {
  const [isLoading, setIsLoading] = useState(false);

  const manualPlaylistCreation = () => {
    setIsLoading(true);
    httpClient.createPlaylist().then(([data, response]) => {
      setIsLoading(false);
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="mb-3">Manual Playlist Creation</h2>
      <div className="w-full flex-grow flex flex-col items-center justify-center">
        <p className="mx-5 mb-4 text-center">
          If you don't want to wait until the end of the month, you can generate
          your Mix Capsule playlist right now by clicking the button below
        </p>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              manualPlaylistCreation();
            }}
          >
            Create Playlist
          </Button>
        )}
      </div>
    </div>
  );
};

ManualPanel.propTypes = {
  httpClient: PropTypes.object.isRequired,
};

export default ManualPanel;
