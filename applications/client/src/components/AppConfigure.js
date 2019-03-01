import React from 'react';
import './AppConfigure.css';
import '../spotify.css';
import Button from 'react-bootstrap/lib/Button';

class AppConfigure extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
                {this.props.isSpotifyUserLogged ?
                    this.showUserLoggedInformation() :

                    <div className={"button-div"}>
                        <Button className={"SpotifyLogInOutButton"} onClick={this.props.logInToSpotifyMethod}>
                            Log In To SPOTIFY
                        </Button>
                    </div>
                }</div>


        );
    }

    showUserLoggedInformation() {
        return (
            <div className={"mainconfigurediv"}>
                <div className={"UserLoggedInformationDiv"}>
                    <h3 className={"UserLoggedInformationDivTitle"}>Profile</h3>
                    <form className={"UserLoggedInformationForm"}>
                        <div className={"UserLoggedInformationDivItemGroup"}>
                            <label className={"UserLoggedInformationItemTitle"}>Name</label>
                            <p className={"UserLoggedInformationItemValue"}>{this.props.spotifyUserLoggedInfo.display_name}</p>
                        </div>
                        <div className={"UserLoggedInformationDivItemGroup"}>
                            <label className={"UserLoggedInformationItemTitle"}>Country</label>
                            <p className={"UserLoggedInformationItemValue"}>{this.props.spotifyUserLoggedInfo.country}</p>
                        </div>
                        <div className={"UserLoggedInformationDivItemGroup"}>
                            <label className={"UserLoggedInformationItemTitle"}>Email</label>
                            <p className={"UserLoggedInformationItemValue"}>{this.props.spotifyUserLoggedInfo.email}</p>
                        </div>
                    </form>
                </div>
                <div className={"button-div"}>
                    <Button className={"SpotifyLogInOutButton"} onClick={this.props.logOutToSpotifyMethod}>Log Out To
                        SPOTIFY</Button>
                </div>
            </div>
        );
    }
}


export default AppConfigure;