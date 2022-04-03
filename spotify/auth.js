const qs = require("qs")
const axios = require("axios")

const SPOTIFY_ACCESS_TOKEN_URL = "https://accounts.spotify.com/api/token"
const getAccessToken = () => {
  const data = qs.stringify({
    grant_type: "client_credentials"
  });
  
  const token = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  const encodedToken = Buffer.from(token).toString("base64")
  console.log(encodedToken)
  
  const config = {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${encodedToken}`
    },
    url: SPOTIFY_ACCESS_TOKEN_URL,
    data
  };
  
  return axios(config).then(res => res.data.access_token);
  
};

module.exports = { getAccessToken }