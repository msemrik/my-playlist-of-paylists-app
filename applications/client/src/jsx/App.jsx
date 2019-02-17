var React = require('react');
var ReactDOM = require('react-dom');
var Button = require('react-bootstrap').Button;


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isSpotifyLogged: false, playlists: ''};
        this.logOut = this.logOut.bind(this);
        this.refreshPlaylists = this.refreshPlaylists.bind(this);
        this.getEveryPlaylist = this.getEveryPlaylist.bind(this);
    }

    logOut(){
        this.setState({  isSpotifyLogged: false,
            playlists:''});
        window.location.replace("/logout");
    }

    componentDidMount() {
        fetch('/spotify/islogged', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},

        })
            .then((result) => {
                    if (result.ok) {
                        this.setState({
                            isSpotifyLogged: true
                        });
                    } else {
                            isSpotifyLogged: false
                    }
                }
            )
     }

    logOutSpotify(event) {
        fetch('/spotify/logout', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
            .then((result) => {
                        this.setState({
                            isSpotifyLogged: false,
                            playlists:''
                        });
                }
            )
    }

    triedToReLogIn() {

        var search = window.location.search;
        var params = new URLSearchParams(search);
        var testFlag = params.get('testFlag');
        if (testFlag) {
            return <h3> You're already logged in </h3>;
        } else
            return;
    };

    loginToSpotify(event) {
        window.location.replace("/spotify/login");
    }

    logoutToSpotify(event) {
        this.logOutSpotify();
    }

    renderLogInButton(){
        return <Button onClick={this.loginToSpotify}>Log In To SPOTIFY</Button>
    }

    refreshPlaylists(){
        // this.getEveryPlaylist();
        fetch('/spotify/user/playlist', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
            .then((result) => {
                    if (result.ok) {
                        result.json().then((data) => {this.setState({playlists: data});});
                    } else {alert('error getting playlist');}
                }
            )
    }

    getEveryPlaylist(){
        fetch('/spotify/user/playlist', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
            .then((result) => {
                    if (result.ok) {
                        result.json().then(function(data){this.setState({playlists: data});});
                    } else {alert('error getting playlist');}
                }
            )
    }

    renderLogOutButton(){
        return <div>
            <Button onClick={this.logoutToSpotify.bind(this)}>Log Out To SPOTIFY</Button>
            <Button onClick={this.refreshPlaylists}>Refresh Playlists</Button>
        </div>
    }

    isSpotifyLogged(){
        // if(this.state.isSpotifyLogged){
        //     this.getEveryPlaylist();
        // }
        return this.state.isSpotifyLogged;
    }



    render() {
        return <div>

            {this.triedToReLogIn()}
            <h1>this is the main page</h1>


            {this.isSpotifyLogged() ? this.renderLogOutButton() : this.renderLogInButton() }

            {this.state.playlists?             this.state.playlists.map(function(object, i){
                return <div key={object.name} >{object.name}</div>;
            }) : undefined}
            {/*<App ref={function (el) {*/}
            {/*if (el) {*/}
            {/*console.log('app posta exist');*/}
            {/*} else {*/}
            {/*console.log('app posta do not exist');*/}
            {/*}*/}
            {/*}}/>*/}
            {/*<App2 ref={function (el) {*/}
            {/*if (el) {*/}
            {/*console.log('app posta exist');*/}
            {/*} else {*/}
            {/*console.log('app posta do not exist');*/}
            {/*}*/}
            {/*}}/>;*/}
            {/*<App2 ref={function (el) {*/}
            {/*if (el) {*/}
            {/*console.log('app posta exist');*/}
            {/*} else {*/}
            {/*console.log('app posta do not exist');*/}
            {/*}*/}
            {/*}}/>;*/}

            {/*<App2></App2>*/}

            <Button onClick={this.logOut}>LogOut</Button>
        </div>
        // React.createElement(App, {'ref': function (el) {if(el){console.log('app posta exist');} else{console.log('app posta do not exist');}}});
    }
}


ReactDOM.render(React.createElement(App), document.getElementById('content'));