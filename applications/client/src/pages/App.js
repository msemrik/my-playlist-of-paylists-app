import './App.css';
import React from 'react';
import PagesEnum from '../enum/pages';
import DefaultLayout from '../components/DefaultLayout';
import AlertDismissable from "../components/common/AlertDismissable";
import PlaylistsPage from "../components/AppPages/PlaylistsPage";
import ConfigurePage from "../components/AppPages/ConfigurePage";
import LoadingModal from "../components/common/LoadingModal";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSpotifyUserLogged: false,
            actualPage: PagesEnum.PLAYLISTS,
            alert: {message: {toShow: false, text: ''}, error: {toShow: false, text: ''}},
            showLoadingModal: false
        };

        this.modifyAlert = this.modifyAlert.bind(this);
        this.resetAlert = this.resetAlert.bind(this);
        this.showLoadingModal = this.showLoadingModal.bind(this);
        this.hideLoadingModal = this.hideLoadingModal.bind(this);

        this.handleResponse = this.handleResponse.bind(this);
    }

    componentDidMount() {
        if (new URLSearchParams(window.location.search).has('loginerror')){
            window.history.pushState("object or string", "Title", "/");
            this.modifyAlert({error: {text: 'There was some error when login to Spotify. Please retry'}});}

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

    handleResponse = function (responseObject) {
        if (responseObject.errorToShow) {
            this.modifyAlert({error: {text: responseObject.errorToShow}});
            if (responseObject.shouldReLogInToSpotify) {
                this.setState({
                    isSpotifyUserLogged: false
                });
            }
        } else {
            this.modifyAlert({message: {text: responseObject.messageToShow}});
        }
    };

    render() {
        return (
            <DefaultLayout isSpotifyUserLogged={this.state.isSpotifyUserLogged} actualPage={this.state.actualPage}
                           onChange={this.transitionateToPage.bind(this)}>
                <LoadingModal showLoadingModal={this.state.showLoadingModal} />
                <AlertDismissable alert={this.state.alert} showLoadingModal={this.state.showLoadingModal} resetAlert={this.resetAlert}/>

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
            handleResponse: this.handleResponse,
            showError: this.showError,
            showMessage: this.showMessage,
            showLoadingModal: this.showLoadingModal,
            hideLoadingModal: this.hideLoadingModal,
        }
    }

    getConfigurePageProps() {
        return {
            isSpotifyUserLogged: this.state.isSpotifyUserLogged,
            spotifyUserLoggedInfo: this.state.userInfo,
            showLoadingModal: this.showLoadingModal,
            hideLoadingModal: this.hideLoadingModal,
        }
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

    resetAlert() {
        this.setState({alert: {message: {toShow: false, text: ''}, error: {toShow: false, text: ''}}});
    }

    showLoadingModal() {
        this.setState({showLoadingModal: true})
    }

    hideLoadingModal() {
        this.setState({showLoadingModal: false})
    }
}

export default App;