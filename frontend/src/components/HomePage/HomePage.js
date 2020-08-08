import React from "react";
import GoogleLogin from "react-google-login";
import { IoIosAlarm, IoMdSettings, IoLogoGithub } from "react-icons/io";
import { FiZap } from "react-icons/fi";

import MixCapsuleHttpClient from "../../httpClients/MixCapsuleHttpClient";
import mcLogo from "../../assets/MC_OrangePurple.png";
import gLogo from "../../assets/g_logo.js";
import audioPlayerIllustration from "../../assets/AudioPlayer.png";

// Tailwind info icon svg
const InfoIcon = () => (
  <svg
    className="fill-current h-6 w-6 text-purple-900 mr-4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
  >
    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
  </svg>
);

const FeatureCard = ({ icon, title, children }) => (
  <div className="my-5 lg:m-5 p-3 lg:w-1/4 rounded bg-gray-400">
    <div className="flex flex-row flex-wrap items-center">
      <div className="p-3 mr-3 rounded-full bg-gray-500">{icon}</div>
      <div className="font-bold text-lg">{title}</div>
    </div>
    <div className="">{children}</div>
  </div>
);

const HomePage = () => {
  const onSignIn = (googleUser) => {
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
  };

  /**
   * A Google login button with customizable text
   * @param {string} children - the text to render in the button
   */
  const GButton = ({ children }) => (
    <GoogleLogin
      clientId="701121595899-aqsiqmiqfl58n3uup5ojss0pam6638q7.apps.googleusercontent.com"
      onSuccess={(user) => onSignIn(user)}
      onFailure={(err) => console.log(err)}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          className="h-7 p-2 bg-white rounded-sm shadow-lg active:shadow-sm flex flex-row items-center disabled:opacity-50"
        >
          <div className="mr-2">{gLogo}</div>
          <div className="text-sm text-gray-700">{children}</div>
        </button>
      )}
    />
  );

  return (
    <div id="HomePage" className="m-0 p-0 flex flex-col">
      <div
        id="header"
        className="m-0 p-0 bg-purple-900 shadow sticky top-0 flex flex-row items-center justify-between"
      >
        <div className="text-purple-400 m-3" href="/">
          <a href="/" className="no-underline">
            Mix Capsule
          </a>
        </div>
        <div className="mx-2">
          <GButton>Sign in with Google</GButton>
        </div>
      </div>
      <div
        id="welcome-panel"
        className="my-24 flex-grow text-center flex flex-col lg:flex-row items-center justify-center"
      >
        <div className="flex flex-row items-center">
          <div className="-ml-10 flex flex-col">
            <div className="-mb-4 text-left font-extrabold text-5xl">Mix</div>
            <div className="m-0 text-left font-extrabold text-5xl">Capsule</div>
            <img className="h-20 object-contain " src={mcLogo} />
          </div>
        </div>
        <div id="spacer" className="h-20 lg:w-56"></div>
        <div className="w-3/4 lg:w-1/4 min-h-64 p-4 mx-2 bg-orange-300 rounded flex flex-row">
          <div className="flex-grow flex flex-col justify-between">
            <div className="mb-4 text-left font-bold text-2xl">
              Time capsule playlists delivered to you every month
            </div>
            <div className="text-left  font-bold">
              Login below to get started
              <div className="w-max-content mt-2">
                <GButton>Sign in with Google</GButton>
              </div>
            </div>
          </div>
          <img
            className="w-1/3 flex-grow object-contain"
            src={audioPlayerIllustration}
          />
        </div>
      </div>
      <div className="w-full bg-gray-900">
        <div id="about" className>
          <h2 className="my-4 text-center text-4xl text-white">About</h2>
          <div className="w-3/4 lg:w-1/2 m-auto text-white">
            <p>
              We all know music can evoke strong memories of the past, as has
              been studied{" "}
              <a href="https://www.bbc.com/culture/article/20140417-why-does-music-evoke-memories">
                many
              </a>{" "}
              times{" "}
              <a href="https://www.psychologytoday.com/us/blog/the-athletes-way/201312/why-do-the-songs-your-past-evoke-such-vivid-memories">
                over
              </a>
              {". "}
              The trouble is, these recollections often come only by chance,
              when you happen to hear a song from your past on the radio or in a
              waiting room. If you take care to record all the music you've
              listened to and when, its easier to connect to the past, but that
              recording process takes far too much time to be worth it.
            </p>
            <br />
            <p>
              This is where Mix Capsule comes in. Once you create your account
              and connect to Spotify, Mix Capsule will deposit a playlist in
              your library every month containing your most listened to songs
              for that month. Now, whenever you want to kick back and listen to
              music that reminds you of the past, flip through your Mix Capsule
              playlists and see what you were listening to 1 month, 6 months, or
              even a year ago.
            </p>
            <br />
            <div className="px-4 py-3 mx-auto bg-purple-400 border-t-4 border-purple-700 rounded-b shadow-md">
              <div className="flex flex-row">
                <div className="py-1">
                  <InfoIcon />
                </div>
                <div>
                  <p className="font-bold">Playlist Folders</p>
                  <p className="text-sm">
                    If you're the kind of person that likes to stay organized,
                    we recommend putting your Mix Capsule playlists in a{" "}
                    <a href="https://support.spotify.com/us/using_spotify/playlists/playlist-folders/">
                      playlist folder
                    </a>{" "}
                    on Spotify to keep them all in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="divider" className="w-5/6 h-px mx-auto bg-white my-4" />
        <div id="features">
          <h2 className="my-4 text-center text-4xl text-white">Features</h2>
          <div className="w-3/4 lg:w-1/2 mx-auto flex flex-col lg:flex-row justify-between">
            <FeatureCard icon={<FiZap />} title="Seamless">
              Mix Capsule integrates with your existing Spotify library so you
              don't have to worry about making any new accounts. Just
              authenticate once with Spotify on the Mix Capsule website and be
              treated to a playlist of your most listened to songs every month.
            </FeatureCard>
            <FeatureCard icon={<IoMdSettings />} title="Automatic">
              After the initial setup, Mix Capsule works without any interaction
              on your part. The sooner you create your account, the more Mix
              Capsule playlist you'll have to look back on in the future!
            </FeatureCard>
            <FeatureCard icon={<IoIosAlarm />} title="Customizable">
              Maybe you want your Mix Capsule playlist generated every two
              months instead of every month, or maybe you want each one to have
              100 songs instead of 50. However you want it, Mix Capsule has
              options to tune your playlist generation exactly as you want it.
            </FeatureCard>
          </div>
        </div>
        <div id="divider" className="w-5/6 h-px mx-auto bg-white my-4" />
        <div id="privacy">
          <h2 className="my-4 text-center text-4xl text-white">Privacy</h2>
          <div className="w-3/4 lg:w-1/2 m-auto text-white">
            <p>
              Mix Capsule takes your privacy seriously. To be able to
              automatically generate playlists in your Spotify library, the
              following permissions are required:
            </p>
            <ul className="my-2 list-disc list-inside lis">
              <li>View content you have recently played</li>
              <li>View your top artists and content</li>
              <li>Create, edit, and follow your private playlists</li>
            </ul>
            <p>
              These permissions will never be used for anything besides
              automatically generating your Mix Capsule playlists, and if you
              ever feel unsure you can revoke Mix Capsule's access{" "}
              <a href="https://www.spotify.com/us/account/apps/">
                on your Spotify account page
              </a>{" "}
              (be aware that this will stop your Mix Capsule playlists from
              being generated).
            </p>
            <br />
            <p>
              For login and customization purposes, Mix Capsule integrates with
              your Google account. This benefits you in two ways:
            </p>
            <ol className="my-2 list-decimal list-inside">
              <li>
                You don't need to remember another set of login credentials
              </li>
              <li>You don't need to trust Mix Capsule with your password</li>
            </ol>
            <p>
              If you're ever unsure of the safety, security or privacy of Mix
              Capsule, the up-to-date source code is available on{" "}
              <a href="https://github.com/P-bibs/MixCapsule">Github</a>
            </p>
            <br />
          </div>
        </div>
      </div>
      <div
        id="footer"
        className="w-full py-4 text-white bg-purple-900 flex flex-row items-center justify-between"
      >
        <div className="mx-4">
          Made by{" "}
          <a className="underline" href="https://paulbiberstein.me/">
            Paul Biberstein
          </a>
        </div>
        <a href="https://github.com/P-bibs/MixCapsule" className="mx-4">
          <IoLogoGithub />
        </a>
      </div>
    </div>
  );
};

export default HomePage;
