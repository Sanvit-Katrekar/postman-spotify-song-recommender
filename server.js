const express = require("express");
const { getAccessToken } = require("./spotify/auth")
const { searchTracks, getRecommendations } = require("./spotify/actions")
const axios = require("axios")

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

app.post("/recommendations", async (req, res) => {
  
  if (!req.body) {
    return res.status(400).send({message: "Bad request! Must provide a body with 3 artists"})
  }
  const {artist1, artist2, artist3} = req.body
  
  if (!(artist1 && artist2 && artist3)) {
    return res.status(400).send({message: "Bad request! Must provide a body with 3 artists"})
  }
  
  let accessToken
  
  try {
    accessToken = await getAccessToken()
  }
  catch (err) {
    console.error(err.message)
  }
  
  
  const http = axios.create({
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });
  
  
  const allArtistsId = {}
  const artistNames = [ artist1, artist2, artist3 ]
  let result, artistId
  try {
    for (const artist in artistNames) {
      result = await searchTracks(http, { artist })
      artistId = result.artists.items[0].id
      allArtistsId[artistNames[artist]] = artistId
    }
    console.log(allArtistsId)
  }
  catch (err) {
    console.error(err.message)
    return res.status(500).send({ message: "Internal Error - Something went wrong when searching for artist" })
  }
  
  /*
  let artistId1 = allArtistsId[artistNames[0]]
  let artistId2 = allArtistsId[artistNames[1]]
  let artistId3 = allArtistsId[artistNames[2]]
  console.log(artistId1)
  */
  
  try {
    const recommendations = await getRecommendations(http, Object.values(allArtistsId))
    if (!recommendations.tracks.length) {
      return res.status(404).send({ message: "No recommendations found!" })
    }
    return res.send(recommendations)
  }
  catch (err) {
    console.error(err.message)
    return res.status(404).send({ message: "No recommendations found!" })
  }


});
console.log("Hello from the server!");

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}! Wow!`);
});