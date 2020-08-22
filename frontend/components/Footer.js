import React from "react";
import { IoLogoGithub } from "react-icons/io";

const Footer = () => (
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

export default Footer;
