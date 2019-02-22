var React = require('react');

class DefaultLayout extends React.Component {
    constructor(props){
        super(props);
        this.logOut = this.logOut.bind(this);
    }

    logOut() {
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
                    <a href="#" >Go To My Playlists</a>
                    <a href="#" onClick={this.logOut}>Logout</a>
                    <a href="#">Configure Spotify Account</a>
                </div>

                <div className="Content"> {this.props.children} </div>

                <div className="footer">
                    <h2>Footer</h2>
                </div>
            </div>
        );
    }
}

module.exports = DefaultLayout;