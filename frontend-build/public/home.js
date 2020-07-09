CLIENT_ID = "701121595899-aqsiqmiqfl58n3uup5ojss0pam6638q7.apps.googleusercontent.com"

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  id_token = googleUser.getAuthResponse().id_token;
  console.log("id_token: " + id_token)
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present. 

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://paulbiberstein.me/MixCapsule/userAuth');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
    console.log(xhr.responseText)
  };
  xhr.send('idtoken=' + id_token);
}


