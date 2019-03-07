import React from 'react';
import PlaylistPageList from "../PlaylistPageComponents/PlaylistPageList";
import NewPlaylistDialog from "../PlaylistPageComponents/NewPlaylistDialog";
import './PlaylistPage.css';
import _ from "lodash";

var Button = require('react-bootstrap').Button;

class PlaylistsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userPlaylists: '', spotifyPlaylistsToBeShown: ''};
        this.getUserPlaylists = this.getUserPlaylists.bind(this);
        this.createPlaylist = this.createPlaylist.bind(this);
        this.savePlaylistsConfiguration = this.savePlaylistsConfiguration.bind(this);
    }

    componentDidMount() {
        if (this.props.isSpotifyUserLogged)
            this.getUserPlaylists();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSpotifyUserLogged !== this.props.isSpotifyUserLogged && nextProps.isSpotifyUserLogged === true)
            this.getUserPlaylists();
    }

    getUserPlaylists() {
        fetch('/spotify/user/playlists', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
            .then((result) => {
                    var state = this;
                    if (result.ok) {
                        result.json().then(function (playlists) {
                            state.setState({userPlaylists: playlists});
                        });
                    } else {
                        result.json().then(function (error) {
                            state.props.showError(error.customErrorMessage);
                        });
                    }
                }
            )
    }

    render() {
        return (
            <div>
                {this.props.isSpotifyUserLogged ?

                    this.showAppPlaylistsApp() :

                    <div>
                        <div className={"playlist-page-title-div"}>

                            <h1 className={"playlist-page-title-text"}>You're not logged to your Spotify account. Please
                                go to
                                Configure Spotify Account.
                            </h1>
                        </div>
                    </div>

                }
            </div>
        );
    }

    showAppPlaylistsApp() {
        return (
            <div className={"playlist-page-content"}>
                <div className={this.state.selectedConfiguredPlaylist? "playlist-page-configured-playlist" : "playlist-page-configured-playlist playlist-page-configured-playlist-full-width"}>
                    <PlaylistPageList {...this.prepareConfiguredPlaylistsList()} />
                </div>

                <div className={this.state.selectedConfiguredPlaylist? "playlist-page-spotify-playlist" : "playlist-page-spotify-playlist playlist-page-spotify-playlist-not-showed"}>
                    <PlaylistPageList {...this.prepareSpotifyPlaylistsList()} />
                </div>
            </div>
        );
    }

    prepareConfiguredPlaylistsList() {
        return {
            playlistPageTitle: "Your configured playlists",
            playlistPageButton: <NewPlaylistDialog title={"Insert new Playlist's name"} action={this.createPlaylist}/>,
            isConfiguredPlaylist: true,
            playlistsToShow: this.state.userPlaylists.configuredPlaylists,
            selectedConfiguredPlaylist: this.state.selectedConfiguredPlaylist,
            itemActionOnClick: (playlist) => this.updateSpotifyPlaylistsSelectedStatus(playlist)
        }
    }

    prepareSpotifyPlaylistsList() {
        return {
            playlistPageTitle: "Your spotify playlists",
            playlistPageButton: <Button className={"playlist-list-button-div-button"}
                                        onClick={(playlist) => this.savePlaylistsConfiguration(playlist)}>
                Save Changes
            </Button>,
            isConfiguredPlaylist: false,
            playlistsToShow: this.state.spotifyPlaylistsToBeShown,
            itemActionOnClick: (playlist) => this.changePlaylistChecked(playlist)
        }
    }

    updateSpotifyPlaylistsSelectedStatus(playlist) {
        this.setState({
            selectedConfiguredPlaylist: playlist,
            spotifyPlaylistsToBeShown: this.state.userPlaylists.spotifyPlaylists.map((spotifyPlaylist) => {
                spotifyPlaylist.selected = _.find(playlist.includedPlaylists, {"playlistId": spotifyPlaylist.id}) ? true : false;
                return spotifyPlaylist;
            })
        })
    }

    changePlaylistChecked(playlist) {
        _.find(this.state.spotifyPlaylistsToBeShown, {id: playlist.id}).selected = !playlist.selected;
        this.setState({
            spotifyPlaylistsToBeShown: this.state.spotifyPlaylistsToBeShown
        })
    }

    createPlaylist(name) {
        fetch('/spotify/createplaylist', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({name: name})
        })
            .then((result) => {
                    var state = this;
                    if (result.ok) {
                        state.props.showMessage("Playlist Successfully created =D");
                        this.getUserPlaylists();
                    } else {
                        state.props.handleError(result, () => alert("Not General Error Only related To Action"));
                    }
                }
            )
    }

    savePlaylistsConfiguration() {
        var playlistToUpdate = this.state.selectedConfiguredPlaylist;
        playlistToUpdate.includedPlaylists = [];
        this.state.spotifyPlaylistsToBeShown.filter((playlist) => playlist.selected).forEach(playlist => {
            playlistToUpdate.includedPlaylists.push(playlist.id);
        });

        fetch('/updateplaylist', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({playlistToUpdate: playlistToUpdate})
        })
            .then((result) => {
                    if (result.ok) {
                        console.log('success updatedplaylist');
                        alert('success updatedplaylist');
                        this.getUserPlaylists();
                    } else {
                        // isSpotifyLogged: false
                        result.json().then((error) => {
                            this.props.handleError(error, (error) => {
                                if (error.errorType === "dbError") {
                                    alert("Internal errors occurred, Please try later. Error desc: " + error.errorMessage);
                                } else if (error.errorType === "spotifyError") {
                                    alert("Changes were saved, but was not able to update Spotify playlsit, try saving later. Error desc: " + error.errorMessage);
                                }
                            });
                        });
                    }
                }
            );
        console.log(playlistToUpdate);
    }
}

export default PlaylistsPage;