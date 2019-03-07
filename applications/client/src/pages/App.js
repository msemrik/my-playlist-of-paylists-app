import './App.css';
import React from 'react';
import PagesEnum from '../enum/pages';
import DefaultLayout from '../components/DefaultLayout';
import AlertDismissable from "../components/AlertDismissable";
import PlaylistsPage from "../components/AppPages/PlaylistsPage";
import ConfigurePage from "../components/AppPages/ConfigurePage";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSpotifyUserLogged: false,
            actualPage: PagesEnum.PLAYLISTS,
            alert: {message: {toShow: false, text: ''}, error: {toShow: false, text: ''}}
        };

        this.modifyAlert = this.modifyAlert.bind(this);
        this.showError = this.showError.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.resetAlert = this.resetAlert.bind(this);

        this.handleError = this.handleError.bind(this);
    }

    componentDidMount() {
        if (new URLSearchParams(window.location.search).has('loginerror'))
            this.modifyAlert({error: {text: 'There was some error when login to Spotify. Please retry'}});

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
            <DefaultLayout isSpotifyUserLogged={this.state.isSpotifyUserLogged} actualPage={this.state.actualPage}
                           onChange={this.transitionateToPage.bind(this)}>

                <AlertDismissable alert={this.state.alert} resetAlert={this.resetAlert}/>

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
            handleError: this.handleError,
            showError: this.showError,
            showMessage: this.showMessage
        }
    }

    getConfigurePageProps() {
        return {
            isSpotifyUserLogged: this.state.isSpotifyUserLogged,
            spotifyUserLoggedInfo: this.state.userInfo
        }
    }

    showError(message){
        this.modifyAlert({error: {text: message}});
    }

    showMessage(message){
        this.modifyAlert({message: {text: message}});
    }


    modifyAlert(alert) {
        var newAlertObject = this.state.alert;
        if (alert.error) {
            if (this.state.alert.error.toShow) {
                newAlertObject.error.text = this.state.alert.error.text + ' ' + alert.error.text;
                this.setState({alert: newAlertObject});
            } else {
                newAlertObject.error.text = alert.error.text;
                newAlertObject.error.toShow = true;
                this.setState({alert: newAlertObject});
            }
        } else {
            if (this.state.alert.message.toShow) {
                newAlertObject.message.text = this.state.alert.message.text + ' ' + alert.message.text;
                this.setState({alert: newAlertObject});
            } else {
                newAlertObject.message.text = alert.message.text;
                newAlertObject.message.toShow = true;
                this.setState({alert: newAlertObject});
            }
        }
    }

    resetAlert(){
        this.setState({alert: {message: {toShow: false, text: ''}, error: {toShow: false, text: ''}}});
    }
}

export default App;