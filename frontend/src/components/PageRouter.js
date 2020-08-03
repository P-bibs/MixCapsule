import React from "react";
import HomePage from "./HomePage/HomePage";
import AppPage from "./AccountPage/AppPage";

export default class PageRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      globalState: {
        CLIENT_ID:
          "701121595899-aqsiqmiqfl58n3uup5ojss0pam6638q7.apps.googleusercontent.com",
      },
    };

    const path = new URL(window.location).pathname;
    if (path === "/") {
      this.page = <HomePage />;
    } else if (path === "/app") {
      this.page = <AppPage />;
    } else {
      this.page = <body></body>;
    }
  }

  render() {
    return this.page;
  }
}
