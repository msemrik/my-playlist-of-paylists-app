import React from 'react';
import './ConfigurePage.css';
import Button from 'react-bootstrap/lib/Button';

class ConfigurePage extends React.Component {

    render() {
        return (<div>
                {this.props.isSpotifyUserLogged ?
                    this.showUserLoggedInformation() :

                    <div className={"button-div"}>
                        <Button className={"configure-page-login-logout-button"}
                                onClick={this.logInToSpotify}>
                            Log In To SPOTIFY
                        </Button>
                    </div>
                }</div>


        );
    }

    showUserLoggedInformation() {
        return (
            <div className={"configure-page-content"}>
                <div className={"configure-page-user-logged-div"}>
                    <h3 className={"configure-page-user-logged-div-title"}>Profile</h3>
                    <form className={"configure-page-user-logged-div-form"}>
                        <div className={"configure-page-user-logged-div-form-item-group"}>
                            <label className={"configure-page-user-logged-div-form-item-group-title"}>Name</label>
                            <p className={"configure-page-user-logged-div-form-item-group-value"}>{this.props.spotifyUserLoggedInfo.display_name}</p>
                        </div>
                        <div className={"configure-page-user-logged-div-form-item-group"}>
                            <label className={"configure-page-user-logged-div-form-item-group-title"}>Country</label>
                            <p className={"configure-page-user-logged-div-form-item-group-value"}>{this.props.spotifyUserLoggedInfo.country}</p>
                        </div>
                        <div className={"configure-page-user-logged-div-form-item-group"}>
                            <label className={"configure-page-user-logged-div-form-item-group-title"}>Email</label>
                            <p className={"configure-page-user-logged-div-form-item-group-value"}>{this.props.spotifyUserLoggedInfo.email}</p>
                        </div>
                    </form>
                </div>
                <div className={"configure-page-logout-button-div"}>
                    <Button className={"configure-page-login-logout-button"} onClick={this.logOutSpotify}>Log
                        Out SPOTIFY</Button>
                </div>
            </div>
        );
    }

    logInToSpotify() {
        window.location.replace("/spotify/login");
    }

    logOutSpotify() {
        window.location.replace("/logout");
    }
}


export default ConfigurePage;