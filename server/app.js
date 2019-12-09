// Imports
var fs = require('fs')
var express = require('express');
const mongoose = require('mongoose');
const {OAuth2Client} = require('google-auth-library');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Initialize globals
var app = express();
const port = 3000

mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});

CLIENT_ID = "701121595899-aqsiqmiqfl58n3uup5ojss0pam6638q7.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);

// Routes
app.get('/MixCapsule', (req, res) => {
  console.log("GET /MixCapsule")
  res.sendFile('index.html', {root: __dirname })
  //res.send('Hello World!')
})

app.post('/MixCapsule/userAuth', (req, res) => {
  console.log("GET /MixCapsule/userAuth")
  idToken = req.body.idtoken
  verify(idToken).catch(console.error);
  res.send('Hello World!')
})

app.get('/MixCapsule/authenticated', (req, res) => {
  console.log("GET /MixCapsule/authenticated")
  res.send('Hello World!')
})

server.configure(function(){
  server.use('/resources', express.static(__dirname + '/resources'));
  server.use(express.static(__dirname + '/public'));
});

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
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
