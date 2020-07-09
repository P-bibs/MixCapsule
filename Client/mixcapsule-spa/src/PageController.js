import React from 'react'
import HomePage from './Home/HomePage'
import SpotifyLinkPage from './SpotifyLink/SpotifyLinkPage'

export default class PageController extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage: 0,
      globalState: {
        CLIENT_ID: "701121595899-aqsiqmiqfl58n3uup5ojss0pam6638q7.apps.googleusercontent.com"
      }
    }
    
    this.changePage = this.changePage.bind(this);

    this.pages = [
      <HomePage/>
    ]
  }

  changePage(data, pageNumber) {
    if (pageNumber >= this.state.currentPage) {
      let _props = {
        globalState: {...this.state.globalState, ...data},
        changePage: this.changePage,
        spotify: this.spotify
      }

      let _pages = [
        <HomePage {..._props}/>,
        <SpotifyLinkPage {..._props}/>,
        //<ConfigurationPage {..._props}/>,
      ]

      this.pages[pageNumber] = _pages[pageNumber]
    }

    this.setState(previousState => {
      return {
        currentPage: pageNumber,
        globalState: {...previousState.globalState, ...data}
      }
    })
  }
  
  parseAccessToken(){
    /*
    var url = window.location.href;
    if (url.includes("access_token=")) {
      var startIndex = url.indexOf("access_token=") + "access_token=".length
      var token = url.substring(startIndex, url.indexOf("&", startIndex))
      
      return token;
    }
    else {
      return -1;
    }
    */
  }
  
  render(){
    return this.pages[this.state.currentPage];
  }
}
