import React from 'react';
import './HomePage.css'

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.onSignIn = this.onSignIn.bind(this);
  }


  onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    let id_token = googleUser.getAuthResponse().id_token;
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
    this.props.changePage({idToken: id_token}, 1)
  }

  loginOnSuccess(user) {

  }
  loginOnFailure(error) {

  }

  componentDidMount() {
    
    window.gapi.signin2.render('gLogin1', {
      'scope': 'profile email',
      'onsuccess': this.onSignIn
    });
    window.gapi.signin2.render('gLogin2', {
      'scope': 'profile email',
      'onsuccess': this.onSignIn
    });
    this.setState(() => {

    })
    let auth2
    var appStart = function() {
      window.gapi.load('auth2', initSigninV2);
    };

    var initSigninV2 = function() {
      auth2 = window.gapi.auth2.init({
          client_id: this.props.globalState.CLIENT_ID,
          scope: 'profile email'
      });
    
      // Listen for sign-in state changes.
      auth2.isSignedIn.listen(signinChanged);
    
      // Listen for changes to current user.
      auth2.currentUser.listen(userChanged);
    
      // Sign in the user if they are currently signed in.
      if (auth2.isSignedIn.get() == true) {
        auth2.signIn();
      }
    
      // Start with the current live values.
      refreshValues();
    };
    
    
    /**
     * Listener method for sign-out live value.
     *
     * @param {boolean} val the updated signed out state.
     */
    var signinChanged = function (val) {
      console.log('Signin state changed to ', val);
      document.getElementById('signed-in-cell').innerText = val;
    };
    
    
    /**
     * Listener method for when the user changes.
     *
     * @param {GoogleUser} user the updated user.
     */
    var userChanged = function (user) {
      console.log('User now: ', user);
      this.setState({googleUser: user})
      updateGoogleUser();
      document.getElementById('curr-user-cell').innerText =
        JSON.stringify(user, undefined, 2);
    };
    
    
    /**
     * Updates the properties in the Google User table using the current user.
     */
    var updateGoogleUser = function () {
      if (this.state.googleUser) {
        document.getElementById('user-id').innerText = this.state.googleUser.getId();
        document.getElementById('user-scopes').innerText =
          this.state.googleUser.getGrantedScopes();
        document.getElementById('auth-response').innerText =
          JSON.stringify(this.state.googleUser.getAuthResponse(), undefined, 2);
      } else {
        document.getElementById('user-id').innerText = '--';
        document.getElementById('user-scopes').innerText = '--';
        document.getElementById('auth-response').innerText = '--';
      }
    };
    
    /**
     * Retrieves the current user and signed in states from the GoogleAuth
     * object.
     */
    var refreshValues = function() {
      if (auth2){
        console.log('Refreshing values...');
    
        this.setState({googleUser: auth2.currentUser.get()})
    
        document.getElementById('curr-user-cell').innerText =
          JSON.stringify(googleUser, undefined, 2);
        document.getElementById('signed-in-cell').innerText =
          auth2.isSignedIn.get();
    
        updateGoogleUser();
      }
    }
  }
  
  render() {
    return (
      <body>
        <div className="header">
          <div className="product-name header-item" href="/">
            <a className="home-link" href="/MixCapsule">MixCapsule</a>
          </div>
          <div id="gLogin1" className="header-item"></div>
        </div>
        <div className="welcome-shade">
          <h1>MixCapsule</h1>
          <br />
          <h2>
          Create monthly time capsules
          <br />
          of your most listened to songs
          </h2>
          <br /><br />
          Get started by signing in with Google
          <div id="gLogin2" className="header-item"></div>
        </div>
        <div className="footer">
        
        </div>
      </body>)
    }
  }
  