import * as constants from "./constants";

export default class ApiWrapper {
  constructor(refreshToken, accessToken) {
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
  }

  static async makeRequestWithoutAuthentication(endpoint, payload, method) {
    const response = await fetch(constants.API_PATH + endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      // redirect: "follow",
      body: JSON.stringify(payload),
    });

    if (response.status !== 200) {
      console.error(
        `ERROR when accessing endpoint ${endpoint} with payload ${payload} and method ${method}`
      );
      console.log(response);
    } else {
      return response;
    }
  }
  
  async makeRequest(endpoint, payload, method) {
    const response = await fetch(constants.API_PATH + endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.accessToken,
      },
      // redirect: "follow",
      body: JSON.stringify(payload),
    });

    if (response.status !== 200) {
      console.error(
        `ERROR when accessing endpoint ${endpoint} with payload ${payload} and method ${method}`
      );
      console.log(response);
      // If the request failed because of an expired access token, get a new one
      if (response.status === 401) {
        if (await this.requestNewAccessToken()) {
          // After we have a new access token, make the request again
          return await this.makeRequest(endpoint, payload, method);
        } else {
          // If the refresh token is expired too, then handle that case
          this.handleExpiredRefreshToken();
        }
      }
    } else {
      return response;
    }
  }

  async requestNewAccessToken() {
    const payload = {
      refresh: this.refreshToken,
    };
    const response = await fetch(constants.API_PATH + "/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // redirect: "follow",
      body: JSON.stringify(payload),
    });
    // If refreshing the access token causes errors, log them
    if (response.status !== 200) {
      console.error("ERROR when refreshing access token");
      console.log(response);
      return false;
    } else {
      // update this objects access token and return successfully
      const body = await response.json();
      console.log(`Received refreshed token`);
      console.log(body);
      const newAccessToken = body.access;
      this.accessToken = newAccessToken;
      console.log("refreshed token successfully");
      return true;
    }
  }

  handleExpiredRefreshToken() {
    console.error("ERROR refresh token expired. Sending back to login screen");
    setTimeout(() => {
      window.location.href = "/";
    }, 5000);
  }
}
