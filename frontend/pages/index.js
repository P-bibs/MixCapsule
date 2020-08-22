import Head from "next/head";
import React, { useEffect, useState } from "react";
import { FiZap } from "react-icons/fi";
import { IoIosAlarm, IoMdSettings } from "react-icons/io";
import Footer from "../components/Footer";
import Header from "../components/Header";
import * as constants from "../constants";
import { generateRedirectUri } from "../httpClients/SpotifyHttpClient";

// Tailwind info icon svg
const InfoIcon = () => (
  <svg
    className="fill-current h-6 w-6 text-fifth mr-4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
  >
    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
  </svg>
);

const FeatureCard = ({ icon, title, children }) => (
  <div className="my-5 lg:m-5 p-3 lg:w-1/4 rounded bg-first space-y-3">
    <div className="flex flex-row flex-wrap items-center">
      <div className="p-3 mr-3 rounded-full bg-gray-500">{icon}</div>
      <div className="font-bold text-lg">{title}</div>
    </div>
    <div className="">{children}</div>
  </div>
);

const MixCapsuleLogo = () => {
  const sizes = [
    0.1,
    0.5,
    0.2,
    0.23,
    0.4,
    0.8,
    0.4,
    0.24,
    0.21,
    1,
    0.22,
    0.15,
    0.1,
    0.15,
    0.1,
    0.5,
  ];
  const maxHeight = 50;
  return (
    <div id="logo" className="w-48 h-16 relative">
      <div className="w-48 h-16 rounded-full bg-fourth absolute top-0" />
      <div className="w-32 z-20 h-full mx-auto relative">
        <div className="w-4 h-20 -mt-2 rounded-full bg-gray-700 absolute left-0" />
        <div className="w-4 h-20 -mt-2 rounded-full bg-gray-700 absolute right-0" />
        <div className="w-20 z-20 h-full mx-auto flex flex-row items-center justify-around">
          {sizes.map((size) => (
            <div
              className="w-1 rounded-full bg-second"
              style={{ height: maxHeight * size }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const maxBars = 50;
const randVals = [...Array(maxBars).keys()].map(() => Math.random());
const vizBarWidth = 40;

const HomePage = () => {
  /**
   * A Spotify login button with customizable text
   * @param {string} children - the text to render in the button
   */
  const SpotifyButton = () => {
    const redirectToSpotify = () => {
      // TODO: add state
      const state = "";
      window.location = generateRedirectUri(
        constants.SPOTIFY_CLIENT_ID,
        constants.REDIRECT_URI,
        constants.SCOPES,
        state
      );
    };
    return (
      <button
        className="h-7 p-2 rounded-sm shadow-lg active:shadow-sm flex flex-row items-center disabled:opacity-50"
        style={{ backgroundColor: "#1DB954" }}
        onClick={redirectToSpotify}
      >
        <img
          className="mr-2 object-contain"
          style={{ width: "21px" }}
          src="Spotify_Icon_RGB_White.png"
        />
        <div className="text-sm text-white">Login with Spotify</div>
      </button>
    );
  };

  const [numVizBars, setNumVizBars] = useState(0);

  useEffect(() => {
    setNumVizBars(
      Math.floor(
        Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0
        ) / vizBarWidth
      )
    );
    window.addEventListener("resize", () => {
      setNumVizBars(
        Math.floor(
          Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
          ) / vizBarWidth
        )
      );
    });
  }, []);

  return (
    <div id="HomePage" className="m-0 p-0 flex flex-col">
      <Head>
        <title>Mix Capsule</title>
      </Head>
      <Header>
        <SpotifyButton>Sign in with Google</SpotifyButton>
      </Header>
      <div
        id="welcome-panel"
        className="pt-24 flex-grow text-center bg-second flex flex-col lg:flex-row items-center justify-center"
      >
        <div className="flex flex-row items-center">
          <div className=" flex flex-col items-center">
            <MixCapsuleLogo />
            <div className="-mb-4 text-first text-center font-extrabold text-6xl">
              Mix Capsule
            </div>
          </div>
        </div>
        <div id="spacer" className="h-20 lg:w-56"></div>
        <div class="w-3/4 lg:w-1/4 min-h-64 p-4 mx-2 bg-third rounded shadow-lg relative z-20">
          <div className="flex flex-row space-x-3">
            <div className="text-first flex-grow flex flex-col justify-between">
              <div className="mb-4 text-left font-bold text-2xl">
                Time capsule playlists delivered to you every month
              </div>
              <div className="text-left  font-bold">
                Login below to get started
                <div className="w-max-content mt-2">
                  <SpotifyButton>Sign in with Google</SpotifyButton>
                </div>
              </div>
            </div>
            <img
              className="w-1/3 flex-grow object-contain"
              src="AudioPlayer.png"
            />
          </div>
        </div>
      </div>
      <div className="pt-40 lg:pt-0 relative bg-second">
        <div class="w-full h-full absolute bottom-0 flex flex-row items-end justify-around">
          {randVals.slice(0, numVizBars).map((v, i) => {
            return (
              <div
                className="viz-bar rounded-full bg-fourth z-10 bottom-0"
                style={{
                  opacity: v + 0.2,
                  animationName: `viz${i % 3}`,
                  animationDuration: `${v * 2 + 1}s`,
                  animationIterationCount: "infinite",
                }}
              />
            );
          })}
        </div>
        <svg
          className="z-20 relative"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#1c202b"
            fill-opacity="1"
            d="M0,192L120,197.3C240,203,480,213,720,224C960,235,1200,245,1320,250.7L1440,256L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="w-full">
        <div id="about" className="bg-gray-900">
          <h2 className="py-4 text-center text-4xl text-white">About</h2>
          <div className="w-3/4 lg:w-1/2 m-auto text-white">
            <p>
              When I started college, I got the advice from a good friend to
              make CDs of all the songs I listened to each semester so I could
              listen to them years down the line and be transported back. It was
              a great idea (after I decided to exchange "CDs" for "playlists"),
              but I had a hard time remembering to keep track of songs as my
              tastes changed, and I quickly started finding holes in my
              self-recorded music history. To solve that problem, I created Mix
              Capsule.
            </p>
            <br />
            <p>
              Once you login with Spotify, Mix Capsule will deposit a playlist
              in your library every month containing your most listened to songs
              for that month. Now, whenever you want to kick back and listen to
              music that reminds you of the past, flip through your Mix Capsule
              playlists and see what you were listening to 1 month, 6 months, or
              even a year ago.
            </p>
            <br />
            <div className="px-4 py-3 mx-auto bg-third border-t-4 border-fifth rounded-b shadow-md">
              <div className="flex flex-row">
                <div className="py-1">
                  <InfoIcon />
                </div>
                <div className="text-first">
                  <p className="font-bold">Playlist Folders</p>
                  <p className="text-sm">
                    If you're the kind of person that likes to stay organized, I
                    recommend putting your Mix Capsule playlists in a{" "}
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

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 163">
          <rect width="100%" height="100%" fill="#1c202b" />
          <path
            fill="#274156"
            fill-opacity="1"
            d="M0,160L120,149.3C240,139,480,117,720,117.3C960,117,1200,139,1320,149.3L1440,160L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
          ></path>
        </svg>
        <div id="features" className="bg-second">
          <h2 className="py-4 text-center text-4xl text-white">Features</h2>
          <div className="w-3/4 mx-auto flex flex-col lg:flex-row justify-between">
            <FeatureCard icon={<FiZap />} title="Seamless">
              Mix Capsule integrates with your existing Spotify library so you
              don't have to worry about making any new accounts. Just
              authenticate once with Spotify on the Mix Capsule website and be
              treated to a playlist of your most listened to songs every month.
            </FeatureCard>
            <FeatureCard icon={<IoIosAlarm />} title="Automatic">
              After the initial setup, Mix Capsule works without any interaction
              on your part. The sooner you create your account, the more
              playlists you'll have to look back on in the future!
            </FeatureCard>
            <FeatureCard icon={<IoMdSettings />} title="Customizable">
              Maybe you want your playlist generated every two months instead of
              every month, or maybe you want each one to have 100 songs instead
              of 50. No matter what, Mix Capsule has options to tune your
              playlist generation exactly as you desire.
            </FeatureCard>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220">
          <rect width="100%" height="100%" fill="#1c202b" />
          <path
            fill="#274156"
            fill-opacity="1"
            d="M0,192L34.3,197.3C68.6,203,137,213,206,213.3C274.3,213,343,203,411,176C480,149,549,107,617,101.3C685.7,96,754,128,823,133.3C891.4,139,960,117,1029,106.7C1097.1,96,1166,96,1234,101.3C1302.9,107,1371,117,1406,122.7L1440,128L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
          ></path>
        </svg>
        <div id="privacy" className="pb-32 bg-gray-900">
          <h2 className="py-4 text-center text-4xl text-white">Privacy</h2>
          <div className="w-3/4 lg:w-1/2 m-auto text-white">
            <p>
              Mix Capsule takes your privacy seriously. To be able to
              automatically generate playlists in your Spotify library, the
              following permissions are required:
            </p>
            <ul className="my-2 list-disc list-inside lis">
              <li>View content you have recently played</li>
              <li>View your top artists and content</li>
              <li>View your email address</li>
              <li>View your private playlists</li>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
