import React from 'react';
import Pages from '../enum/pages';

class DefaultLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {height: "50px"}
        this.logOutApplication = this.logOutApplication.bind(this);
        this.resize = this.resize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    resize(){

        if(window.innerWidth < 768){
            const headerTopNavHeight = this.headerTopNav.clientHeight;
            const headerHeight = this.headerElement.clientHeight;
            this.setState({topNavHeight: (headerTopNavHeight + 10)+ "px", headerHeight: headerHeight + headerTopNavHeight + 10});
        } else {
            const headerHeight = this.headerElement.clientHeight;
            this.setState({headerHeight: (headerHeight)+ "px", topNavHeight: 0/*, contentHeight: window.innerHeight - headerHeight*/});
        }
    }
    render() {
        return (
            <div>
                <div className="header" ref={(headerElement) => this.headerElement = headerElement} style={{marginTop: this.state.topNavHeight}}>
                    <div className="header-title">
                        <h1>My Playlist of Playlists App</h1>
                        <p>Create playlist that automatically updates with other playlists' songs.</p>
                    </div>
                    <div className="header-topnav" ref={(headerTopNav) => this.headerTopNav = headerTopNav}>
                        <div className="header-topnav-buttons">
                            <div>
                                <a href="#" className={this.setClassName(Pages.PLAYLISTS)}
                                   onClick={() => this.props.onChange(Pages.PLAYLISTS)}>Go To My Playlists</a>
                                {this.props.isSpotifyUserLogged?
                                    <a href="#" onClick={this.logOutApplication}>Logout</a>:
                                    undefined
                                }

                                <a href="#" className={this.setClassName(Pages.SPOTIFYCONFIGURATION)}
                                   onClick={() => this.props.onChange(Pages.SPOTIFYCONFIGURATION)}>Configure Spotify
                                    Account</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{top: this.state.headerHeight/*, height: this.state.contentHeight*/}} ref={(contentElement) => this.contentElement = contentElement} className="content">
                    <div className="content-view-port">
                        {this.props.children}
                    </div>
                </div>

                <div className="footer">
                    <p>Recommend to your friends ;)</p>
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