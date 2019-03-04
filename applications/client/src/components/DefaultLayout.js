import React from 'react';
import Pages from '../enum/pages';

class DefaultLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {height: "50px"}
        this.logOutApplication = this.logOutApplication.bind(this);
    }

    componentDidMount() {
        const headerHeight = this.headerElement.clientHeight;
        this.setState({headerHeight: (headerHeight -10)+ "px"});
    }

    render() {
        return (
            <div>
                <div className="header" ref={(headerElement) => this.headerElement = headerElement}>
                    <div className="header-title">
                        <h1>My Playlist of Playlists App</h1>
                        <p>Create playlist that automatically updates with other playlists' songs.</p>
                    </div>
                    <div className="header-topnav">
                        <div className="header-topnav-buttons">
                            <div>
                                <a href="#" className={this.setClassName(Pages.PLAYLISTS)}
                                   onClick={() => this.props.onChange(Pages.PLAYLISTS)}>Go To My Playlists</a>
                                <a href="#" onClick={this.logOutApplication}>Logout</a>
                                <a href="#" className={this.setClassName(Pages.SPOTIFYCONFIGURATION)}
                                   onClick={() => this.props.onChange(Pages.SPOTIFYCONFIGURATION)}>Configure Spotify
                                    Account</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{marginTop: this.state.headerHeight}} ref={(contentElement) => this.contentElement = contentElement} className="content">
                    <div className="content-view-port">
                        {this.props.children}
                    </div>
                </div>

                <div className="footer">
                    <h4>Recommend to your friends ;)</h4>
                </div>
            </div>

        );
    }

    setClassName(page) {
        if (page === this.props.actualPage) {
            return "selected";
        }
    }

    logOutApplication() {
        window.location.replace("/logout");
    }
}

export default DefaultLayout;