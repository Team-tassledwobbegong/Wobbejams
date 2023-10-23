const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
dotenv.config();
app.use(express.json());

app.post('/login', (req, res) => {
  const code = req.body.code;
  console.log('code' + code);
  const spotifyApi = new SpotifyWebApi({
    clientId: 'f8e5d3d4e353428c837bc038cc42f9a2',
    clientSecret: '667adf1ee38e4e46934a1fc78a472d85',
    redirectUri: 'http://localhost:3000',
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.send({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
      console.log(data);
    })
    .catch(err => console.log(err));
});

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    clientId: '638fa075b2e7492490a8ab9eb0a6750e',
    clientSecret: 'c596188e4c994b29a8a30d195108153d',
    redirectUri: 'http://localhost:3000',
    refreshToken: refreshToken,
  });
  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => res.send(err));
});

app.use('/dist', express.static(path.join(__dirname, '../dist')));

// app.get('/search', (req, res) => {
//   console.log('/SEARCH ROUTER IS RUNNING')
//   return res.status(200).sendFile(path.join(__dirname, '../client/search.html'));
// });
// serve index.html on the route '/'
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(3000, console.log(`listening on PORT:${3000}`));
