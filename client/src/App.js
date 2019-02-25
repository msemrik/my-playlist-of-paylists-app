// import logo from './logo.svg';
// import ReactDOM from 'react-dom';
// import Bootstrap from 'react-bootstrap';
// import AlertDismissable from './AlertDismissable';
import './App.css';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import DefaultLayout from './DefaultLayout';
import PlayListListGroup from './PlayListListGroup';
import TextModal from './TextModal';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isSpotifyLogged: false, playlists: '', showModal: false};
        this.logOut = this.logOut.bind(this);
        this.refreshPlaylists = this.refreshPlaylists.bind(this);
        this.getEveryPlaylist = this.getEveryPlaylist.bind(this);
        this.createPlaylist = this.createPlaylist.bind(this);
        this.createNewPlayList = this.createNewPlayList.bind(this);
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
            headers: {"Content-Type": "application/json"},

        })
            .then((result) => {
                    if (result.ok) {
                        this.setState({
                            isSpotifyLogged: true
                        });
                    } else {
                        this.setState({
                        isSpotifyLogged: false
                        });
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
                        playlists: ''
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

    renderLogInButton() {
        return <Button onClick={this.loginToSpotify}>Log In To SPOTIFY</Button>
    }

    refreshPlaylists() {
        // this.getEveryPlaylist();
        fetch('/spotify/user/playlist', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
            .then((result) => {
                    if (result.ok) {
                        result.json().then((data) => {
                            this.setState({playlists: data});
                        });
                    } else {
                        alert('error getting playlist');
                    }
                }
            )
    }

    getEveryPlaylist() {
        fetch('/spotify/user/playlist', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
            .then((result) => {
                    if (result.ok) {
                        result.json().then(function (data) {
                            this.setState({playlists: data});
                        });
                    } else {
                        alert('error getting playlist');
                    }
                }
            )
    }

    renderLogOutButton() {
        return <div>
            <Button onClick={this.logoutToSpotify.bind(this)}>Log Out To SPOTIFY</Button>
            <Button onClick={this.refreshPlaylists}>Refresh Playlists</Button>
        </div>
    }

    isSpotifyLogged() {
        // if(this.state.isSpotifyLogged){
        //     this.getEveryPlaylist();
        // }
        return this.state.isSpotifyLogged;
    }

    printPlaylists() {
        var elementToReturn = [];

        if (this.state.playlists){
            elementToReturn = (<PlayListListGroup playLists={this.state.playlists}> </PlayListListGroup>);
        }

        return elementToReturn;
    }

    createPlaylist(name){
        fetch('/spotify/createplaylist', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({name: name})
        })
            .then((result) => {
                    if (result.ok) {
                        // this.setState({
                        //     isSpotifyLogged: true
                        // });
                        // this.setState({showModal: true});
                        console.log('success createplaylist');
                        alert('success createplaylist');
                    } else {
                        // isSpotifyLogged: false
                        console.log('failed createplaylist');
                        alert('failed createplaylist');
                    }
                }
            )
    }


    createNewPlayList(){
        return <TextModal title={"Insert new Playlist's name"} action={this.createPlaylist}></TextModal>;
    }

    render() {
        return (
         <DefaultLayout>
            {this.triedToReLogIn()}

            <h1>this is the main page</h1>

            {this.isSpotifyLogged() ? this.renderLogOutButton() : this.renderLogInButton()}

            <button type="button" className="btn btn-primary" onClick={this.createNewPlayList} >Add Playlist </button>
            {this.createNewPlayList()}
            {this.printPlaylists()}
            {this.printPlaylists()}

            </DefaultLayout>


        );
    }
}


export default App;
