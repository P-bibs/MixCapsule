// Imports
var fs = require('fs')
var express = require('express');
const mongoose = require('mongoose');
const {OAuth2Client} = require('google-auth-library');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { Pool } = require('pg')

// Initialize globals
var app = express();
const port = 3000
app.use(express.urlencoded());

CLIENT_ID = "701121595899-aqsiqmiqfl58n3uup5ojss0pam6638q7.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);

const pgPool = new Pool();

// Routes
app.get('/MixCapsule', (req, res) => {
  console.log("GET /MixCapsule")
  res.sendFile('index.html', {root: __dirname })
  //res.send('Hello World!')
})

app.post('/MixCapsule/userAuth', (req, res) => {
  console.log("GET /MixCapsule/userAuth")
  idToken = req.body.idtoken
  verify(idToken).then((result) => {
    email = result.email;
    refreshTokenQuery = "SELECT refresh_token FROM users WHERE email='" + email + "'"
    console.log("Querying with query " + refreshTokenQuery)
    return pgPool.query(testQuery);
  })
  .then((result) => {
    console.log("Found refresh token")
    console.log(result.rows)
    res.send('Received id token')
  })
  .catch(console.error);
})

app.get('/MixCapsule/authenticated', (req, res) => {
  console.log("GET /MixCapsule/authenticated")
  res.send('Hello World!')
})

app.use('/MixCapsule/public', express.static('public'));

async function verify(idToken) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log("Response from verify")
  console.log(payload)
  return payload
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
