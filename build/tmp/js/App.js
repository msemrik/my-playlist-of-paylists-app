var React = require('react');

var ReactDOM = require('react-dom');

var Button = require('react-bootstrap').Button;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpotifyLogged: false,
      playlists: ''
    };
    this.logOut = this.logOut.bind(this);
    this.refreshPlaylists = this.refreshPlaylists.bind(this);
    this.getEveryPlaylist = this.getEveryPlaylist.bind(this);
  }

  logOut() {
    this.setState({
      isSpotifyLogged: false,
      playlists: ''
    });
    window.location.replace("/logout");
  }

  componentDidMount() {
    fetch('/spotify/islogged', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(result => {
      if (result.ok) {
        this.setState({
          isSpotifyLogged: true
        });
      } else {
        isSpotifyLogged: false;
      }
    });
  }

  logOutSpotify(event) {
    fetch('/spotify/logout', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(result => {
      this.setState({
        isSpotifyLogged: false,
        playlists: ''
      });
    });
  }

  triedToReLogIn() {
    var search = window.location.search;
    var params = new URLSearchParams(search);
    var testFlag = params.get('testFlag');

    if (testFlag) {
      return React.createElement("h3", null, " You're already logged in ");
    } else return;
  }

  loginToSpotify(event) {
    window.location.replace("/spotify/login");
  }

  logoutToSpotify(event) {
    this.logOutSpotify();
  }

  renderLogInButton() {
    return React.createElement(Button, {
      onClick: this.loginToSpotify
    }, "Log In To SPOTIFY");
  }

  refreshPlaylists() {
    // this.getEveryPlaylist();
    fetch('/spotify/user/playlist', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(result => {
      if (result.ok) {
        result.json().then(data => {
          this.setState({
            playlists: data
          });
        });
      } else {
        alert('error getting playlist');
      }
    });
  }

  getEveryPlaylist() {
    fetch('/spotify/user/playlist', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(result => {
      if (result.ok) {
        result.json().then(function (data) {
          this.setState({
            playlists: data
          });
        });
      } else {
        alert('error getting playlist');
      }
    });
  }

  renderLogOutButton() {
    return React.createElement("div", null, React.createElement(Button, {
      onClick: this.logoutToSpotify.bind(this)
    }, "Log Out To SPOTIFY"), React.createElement(Button, {
      onClick: this.refreshPlaylists
    }, "Refresh Playlists"));
  }

  isSpotifyLogged() {
    // if(this.state.isSpotifyLogged){
    //     this.getEveryPlaylist();
    // }
    return this.state.isSpotifyLogged;
  }

  render() {
    return React.createElement("div", null, this.triedToReLogIn(), React.createElement("h1", null, "this is the main page"), this.isSpotifyLogged() ? this.renderLogOutButton() : this.renderLogInButton(), this.state.playlists ? this.state.playlists.map(function (object, i) {
      return React.createElement("div", {
        key: object.name
      }, object.name);
    }) : undefined, React.createElement(Button, {
      onClick: this.logOut
    }, "LogOut")); // React.createElement(App, {'ref': function (el) {if(el){console.log('app posta exist');} else{console.log('app posta do not exist');}}});
  }

}

ReactDOM.render(React.createElement(App), document.getElementById('content'));