import * as constants from "../constants";

export default class MixCapsuleHttpClient {
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
        `ERROR when accessing endpoint ${endpoint} with payload ${payload.toString()} and method ${method}`
      );
      console.log(response);
      return [{}, response]
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
    const [data, response] = await MixCapsuleHttpClient.makeRequest(
      endpoint,
      method,
      payload,
      newHeaders
    );
    if (response.status === 401) {
      console.log("Error authorizing, attempting to refresh token")
      if (await this.requestNewAccessToken()) {
        console.log("Successfully refreshed token")
        // After we have a new access token, make the request again
        return await this.makeAuthenticatedRequest(endpoint, method, payload);
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
    const [data, response] = await MixCapsuleHttpClient.makeRequest(
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
      console.log(`Received refreshed token`);
      console.log(data);
      const newAccessToken = data.access;
      this.accessToken = newAccessToken;
      console.log("refreshed token successfully");
      return true;
    }
  }

  handleExpiredRefreshToken() {
    console.error("ERROR refresh token expired. Sending back to login screen");
    setTimeout(() => {
      window.location.href = "/";
    }, 10000);
  }
}
