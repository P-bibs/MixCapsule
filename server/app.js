var fs = require('fs')
var express = require('express');
var app = express();

app.get('/', function(req, res){

    let config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", 'utf8'));

    id = config.SETUP.id
    redirect_uri = config.SETUP.redirect
    scope = config.SETUP.scope

    var base = "https://accounts.spotify.com/authorize";
    var payload = {
        client_id: id,
        response_type: 'code',
        redirect_uri: redirect_uri,
        scope: scope
    };

    var esc = encodeURIComponent;
    var query = Object.keys(payload)
        .map(k => esc(k) + '=' + esc(payload[k]))
        .join('&');

    console.log("Query: " + query);
    auth_uri = base + "?" + query

    return res.redirect(auth_uri)
});


app.get('/authenticated', function(req, res) {
    let code = req.query.code
    writeCode(code)
    res.send("You may now close this page")
});

app.listen(3000, function() {
  console.log('App listening on port 3000!');
});

//Change this function when switching from dev to build
function writeCode(code) {

    var obj = JSON.parse(fs.readFileSync(__dirname + "/../config.json", 'utf8'));

    obj.DATA = {...obj.DATA, code: code}

    json = JSON.stringify(obj, null, 4)

    console.log("writing json to file")
    console.log(json)

    fs.writeFile(__dirname + "/../config.json", json, 'utf8', function(err) {
        if(err) {
            return console.log(err);
        }
        else{
            console.log("The file was saved!");
        }
    });
}