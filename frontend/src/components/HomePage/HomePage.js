import React from "react";
import GoogleLogin from "react-google-login";

import MixCapsuleHttpClient from "../../httpClients/MixCapsuleHttpClient";

export default class HomePage extends React.Component {
  onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log("id_token: " + googleUser.getAuthResponse().id_token);
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.

    const payload = {
      google_token: googleUser.getAuthResponse().id_token,
    };
    MixCapsuleHttpClient.makeRequest("/token/request/", "POST", payload).then(
      ([data, response]) => {
        console.log(data);
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        window.location.href = "/app";
      }
    );
  }

  render() {
    return (
      <div id="HomePage" className="h-screen m-0 p-0 flex flex-col">
        <div className="h-7 m-0 p-0 bg-purple-900 flex flex-row items-center justify-between">
          <div className="text-purple-400 m-3" href="/">
            <a href="/">
              MixCapsule
            </a>
          </div>
          <div id="gLogin1"></div>
        </div>
        <div className="flex-grow text-center flex flex-col items-center justify-center">
          <h1>MixCapsule</h1>
          <br />
          <h2>
            Create monthly time capsules
            <br />
            of your most listened to songs
          </h2>
          <br />
          <br />
          Get started by signing in with Google
          <br />
          <br />
          <GoogleLogin
            clientId="701121595899-aqsiqmiqfl58n3uup5ojss0pam6638q7.apps.googleusercontent.com"
            onSuccess={(user) => this.onSignIn(user)}
            onFailure={(err) => console.log(err)}
          />
        </div>
        <div id="footer" className="h-20 bg-purple-900"></div>
      </div>
    );
  }
}
