import React from "react";
import { IoLogoGithub } from "react-icons/io";

export const Header = ({ children }) => (
  <div
    id="header"
    className="m-0 p-0 bg-third shadow sticky z-30 top-0 flex flex-row items-center justify-between"
  >
    <div className="text-white m-3" href="/">
      <a href="/" className="no-underline">
        Mix Capsule
      </a>
    </div>
    <div className="mx-2">{children}</div>
  </div>
);

export const Footer = () => (
  <div
    id="footer"
    className="w-full py-4 text-white bg-third flex flex-row items-center justify-between"
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
);
