import * as constants from "./constants";

export default class ApiWrapper {
  constructor(refreshToken, accessToken) {
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
  }

  static async makeRequest(
    endpoint,
    method = "GET",
    payload = {},
    headers = {}
  ) {
    const response = await fetch(constants.API_PATH + endpoint, {
      method: method,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: method === "GET" ? null : JSON.stringify(payload),
    });

    if (response.status !== 200) {
      console.error(
        `ERROR when accessing endpoint ${endpoint} with payload ${payload} and method ${method}`
      );
      console.log(response);
    } else {
      const decodedBody = await response.json();
      return [decodedBody, response];
    }
  }

  async makeAuthenticatedRequest(
    endpoint,
    method = "GET",
    payload = {},
    headers = {}
  ) {
    const newHeaders = {
      ...headers,
      Authorization: "Bearer " + this.accessToken,
    };
    const [data, response] = await ApiWrapper.makeRequest(
      endpoint,
      method,
      payload,
      newHeaders
    );
    if (response.status === 401) {
      if (await this.requestNewAccessToken()) {
        // After we have a new access token, make the request again
        return await this.makeAuthenticatedRequest(endpoint, payload, method);
      } else {
        // If the refresh token is expired too, then handle that case
        this.handleExpiredRefreshToken();
      }
    } else {
      return [data, response];
    }
  }

  async requestNewAccessToken() {
    const payload = {
      refresh: this.refreshToken,
    };
    const [, response] = await ApiWrapper.makeRequest(
      "/token/refresh/",
      "POST",
      payload
    );
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
