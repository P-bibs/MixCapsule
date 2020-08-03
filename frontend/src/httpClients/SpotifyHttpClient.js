export const generateRedirectUri = (clientId, redirectUrl, scope, state) => {
  return (
    `https://accounts.spotify.com/authorize?` +
    `client_id=${clientId}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `state=${state}`
  );
};
