import './App.css';
import React from 'react';
import PagesEnum from '../enum/pages';
import DefaultLayout from '../components/DefaultLayout';
import PlaylistsPage from "../components/AppPages/PlaylistsPage";
import ConfigurePage from "../components/AppPages/ConfigurePage";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSpotifyUserLogged: false,
            actualPage: PagesEnum.PLAYLISTS,
        };
        this.handleError = this.handleError.bind(this);
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
                    });
                } else {
                    this.setState({
                        isSpotifyUserLogged: false
                    });
                }
            }
        )
    }

    transitionateToPage = function (page) {
        this.setState({actualPage: page});
    };

    handleError = function (errorObject, errorFunction) {
        if (errorObject.shouldReLogInToSpotify) {
            this.setState({
                isSpotifyUserLogged: false
            });
            alert("SPOTIFY SESSION ENDED.");
        } else if (errorObject.unrecoverableError) {
            alert("APPLICATION IS NOT WORKING RIGHT NOW COME BACK LATER PLEASE.");
        } else {
            errorFunction(errorObject);
        }
    };

    render() {
        return (
            <DefaultLayout actualPage={this.state.actualPage} onChange={this.transitionateToPage.bind(this)}>
                {
                    this.state.actualPage === PagesEnum.PLAYLISTS ?
                        <PlaylistsPage {...this.getPlaylistPageProps()}/> :
                        <ConfigurePage {...this.getConfigurePageProps()}/>
                }
            </DefaultLayout>
        );
    }

    getPlaylistPageProps() {
        return {
            isSpotifyUserLogged: this.state.isSpotifyUserLogged,
            handleError: this.handleError
        }
    }

    getConfigurePageProps() {
        return {
            isSpotifyUserLogged: this.state.isSpotifyUserLogged,
            spotifyUserLoggedInfo: this.state.userInfo,
            logInToSpotifyMethod: this.logInToSpotify.bind(this),
            logOutToSpotifyMethod: this.logOutToSpotify.bind(this)
        }
    }



    //Move to configure
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
                });
            }
        )
    }
}
export default App;