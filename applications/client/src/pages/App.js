import './App.css';
import React from 'react';
import DefaultLayout from '../components/DefaultLayout';
import Pages from '../enum/pages';
import AppPlaylists from "../components/AppPlaylists";
import AppConfigure from "../components/AppConfigure";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSpotifyUserLogged: false,
            userPlaylists: '',
            page: Pages.PLAYLISTS,
            showModal: false
        };

        this.getUserPlaylists = this.getUserPlaylists.bind(this);
    }

    componentDidMount() {
        fetch('/spotify/islogged', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        }).then((result) => {
                var state = this;
                if (result.ok) {
                    result.json().then(function (userData) {
                        state.setState({
                            isSpotifyUserLogged: true,
                            userInfo: userData
                        });
                        state.getUserPlaylists();
                    });
                } else {
                    this.setState({
                        isSpotifyUserLogged: false
                    });
                }
            }
        )
    }

    getUserPlaylists() {
        fetch('/spotify/user/playlists', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
            .then((result) => {
                    var state = this;
                    if (result.ok) {
                        result.json().then(function (data) {
                            state.setState({userPlaylists: data});
                        });
                    } else {
                        alert('error getting playlist');
                    }
                }
            )
    }

    isSpotifyUserLogged() {
        return this.state.isSpotifyUserLogged;
    }

    logInToSpotify() {
        window.location.replace("/spotify/login");
    }

    logOutToSpotify() {
        fetch('/spotify/logout', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        }).then(() => {
                this.setState({
                    isSpotifyUserLogged: false,
                    playlists: ''
                });
            }
        )
    }

    transitionateToPage = function (page) {
        console.log("received request to transitionate " + page);
        this.setState({page: page});
    }

    render() {
        return (
            <DefaultLayout page={this.state.page} onChange={this.transitionateToPage.bind(this)}>

                {
                    this.state.page == Pages.PLAYLISTS ?
                        <AppPlaylists {...this.getAppPlaylistsProps()}/> :
                        <AppConfigure {...this.getAppConfigureProps()}/>
                }
            </DefaultLayout>
        );
    }

    getAppPlaylistsProps() {
        return {
            isSpotifyUserLogged: this.state.isSpotifyUserLogged,
            userPlaylists: this.state.userPlaylists
        }
    }

    getAppConfigureProps() {
        return {
            isSpotifyUserLogged: this.state.isSpotifyUserLogged,
            spotifyUserLoggedInfo: this.state.userInfo,
            logInToSpotifyMethod: this.logInToSpotify.bind(this),
            logOutToSpotifyMethod: this.logOutToSpotify.bind(this)
        }
    }
}

export default App;


// {this.triedToReLogIn()}
//
// triedToReLogIn() {
//
//     var search = window.location.search;
//     var params = new URLSearchParams(search);
//     var testFlag = params.get('testFlag');
//     if (testFlag) {
//         return <h3> You're already logged in </h3>;
//     } else
//         return;
// };


//To configure

// {this.isSpotifyUserLogged() ? this.renderLogOutButton() : this.renderLogInButton()}

// logOutSpotifyUser() {
//     fetch('/spotify/logout', {
//         method: 'POST',
//         headers: {"Content-Type": "application/json"},
//     }).then(() => {
//             this.setState({
//                 isSpotifyUserLogged: false,
//                 playlists: ''
//             });
//         }
//     )
// }


// renderLogInButton() {
//     return <Button onClick={this.loginToSpotify}>Log In To SPOTIFY</Button>
// }

// loginToSpotify(event) {
//     window.location.replace("/spotify/login");
// }


// renderLogOutButton() {
//     return <div>
{/*<Button onClick={this.logOutSpotifyUser.bind(this)}>Log Out To SPOTIFY</Button>*/
}
{/*<Button onClick={this.refreshPlaylists}>Refresh Playlists</Button>*/
}
// </div>
// }


//
// refreshPlaylists() {
//     // this.getEveryPlaylist();
//     fetch('/spotify/user/playlist', {
//         method: 'POST',
//         headers: {"Content-Type": "application/json"},
//     })
//         .then((result) => {
//                 if (result.ok) {
//                     result.json().then((data) => {
//                         this.setState({playlists: data});
//                     });
//                 } else {
//                     alert('error getting playlist');
//                 }
//             }
//         )
// }
//
// getEveryPlaylist() {
//     fetch('/spotify/user/playlist', {
//         method: 'POST',
//         headers: {"Content-Type": "application/json"},
//     })
//         .then((result) => {
//                 if (result.ok) {
//                     result.json().then(function (data) {
//                         this.setState({playlists: data});
//                     });
//                 } else {
//                     alert('error getting playlist');
//                 }
//             }
//         )
// }
//
//
// printPlaylists() {
//     var elementToReturn = [];
//
//     if (this.state.playlists) {
//         elementToReturn = (<PlayListList playLists={this.state.playlists}> </PlayListList>);
//     }
//
//     return elementToReturn;
// }
//
// createPlaylist(name) {
//     fetch('/spotify/createplaylist', {
//         method: 'POST',
//         headers: {'Content-Type': "application/json"},
//         body: JSON.stringify({name: name})
//     })
//         .then((result) => {
//                 if (result.ok) {
//                     // this.setState({
//                     //     isSpotifyLogged: true
//                     // });
//                     // this.setState({showModal: true});
//                     console.log('success createplaylist');
//                     alert('success createplaylist');
//                 } else {
//                     // isSpotifyLogged: false
//                     console.log('failed createplaylist');
//                     alert('failed createplaylist');
//                 }
//             }
//         )
// }
//
//
// createNewPlayList() {
//     return <NewPlaylistDialog title={"Insert new Playlist's name"} action={this.createPlaylist}></NewPlaylistDialog>;
// }