import Head from "next/head";
import React, { useEffect } from "react";
import MixCapsuleHttpClient from "../httpClients/MixCapsuleHttpClient";

const RedirectPage = () => {
  useEffect(() => {
    checkForAndSendSpotifyCode();
  }, []);

  const checkForAndSendSpotifyCode = () => {
    // Search for spotify access token in case we've just been redirected
    const url = new URL(window.location);
    const params = url.searchParams;
    if (params.has("code")) {
      const spotifyCode = params.get("code");
      console.log(`found api code ${spotifyCode}. Sending backend request...`);
      MixCapsuleHttpClient.requestToken(spotifyCode).then(
        ([data, response]) => {
          console.log("Successfully POSTed spotify auth");
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          if (response.status === 200) {
            console.log("redirecting without code");
            window.location.href = "/app";
          }
        }
      );
    } else if (window.location.hash.includes("error")) {
      console.error(window.location.hash);
    }
  };

  return (
    <div id="RedirectPage" className="min-h-screen lg:h-screen w-full">
      <Head>
        <title>Mix Capsule</title>
      </Head>
      Redirecting
    </div>
  );
};

export default RedirectPage;
