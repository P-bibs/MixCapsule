export const generateRedirectUri = (clientId, redirectUrl, scope, state) => {
  return `https://accounts.spotify.com/authorize?
  client_id=${clientId}&
  response_type=code&
  redirect_uri=${encodeURIComponent(redirectUrl)}&
  scope=${encodeURIComponent(scope)}&
  state=${state}`;
};

curl -H "Authorization: Basic ZjM...zE="
-d grant_type=authorization_code
-d code=MQCbtKe...44KN
-d redirect_uri=https%3A%2F%2Fwww.foo.com%2Fauth
https://accounts.spotify.com/api/token