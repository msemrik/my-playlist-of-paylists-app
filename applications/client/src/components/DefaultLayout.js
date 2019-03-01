import React from 'react';
import Pages from '../enum/pages';

class DefaultLayout extends React.Component {
    constructor(props) {
        super(props);
        this.logOutApplication = this.logOutApplication.bind(this);
    }

    logOutApplication() {
        window.location.replace("/logout");
    }

    render() {
        return (

            <div>
                <div className="header">
                    <h1>My Playlist of Playlists App</h1>
                    <p>Create playlist that automatically updates with other playlists' songs.</p>
                </div>

                <div className="topnav">
                    <a href="#" className={this.setClassName(Pages.PLAYLISTS)} onClick={() => this.props.onChange(Pages.PLAYLISTS)}>Go To My Playlists</a>
                    <a href="#" onClick={this.logOutApplication}>Logout</a>
                    <a href="#" className={this.setClassName(Pages.SPOTIFYCONFIGURATION)} onClick={() => this.props.onChange(Pages.SPOTIFYCONFIGURATION)}>Configure Spotify Account</a>
                </div>

                <div className="Content"> {this.props.children} </div>

                <div className="footer">
                    <h2>Footer</h2>
                </div>
            </div>
        );
    }

    setClassName(page){
        if(page === this.props.page){
            return "selected";
        }
    }
}

export default DefaultLayout;