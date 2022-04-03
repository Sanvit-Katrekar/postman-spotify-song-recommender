const baseUrl = "https://api.spotify.com/v1"
const searchTracks = async (http, { artist }) => {
  const config = {
    method: "get",
    url: `${baseUrl}/search?q=${artist}&type=artist`,
  };

  return http(config).then((response) => response.data);
};

const getRecommendations = async (http, [ artistId1, artistId2, artistId3 ]) => {
  const config = {
    method: "get",
    url: `${baseUrl}/recommendations?seed_artists=${artistId1},${artistId2},${artistId3}`
  };

  return http(config).then((response) => response.data)
};

module.exports = { searchTracks, getRecommendations };
