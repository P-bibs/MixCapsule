import React from "react";

const Header = ({ children }) => (
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

export default Header;
