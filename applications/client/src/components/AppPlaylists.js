import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import './AppPlaylists.css';
import '../spotify.css';
import PlayListList from "./PlayListList";


class AppPlaylists extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
                {this.props.isSpotifyUserLogged ? this.showAppPlaylistsApp() :
                    <div className={"SpotifyTitleDiv"}>
                        <h1 className={"SpotifyTitleText"}>You're not logged to your Spotify account. Please go to
                            Configure Spotify Account.
                        </h1>
                    </div>
                }
            </div>
        );
    }

    showAppPlaylistsApp() {

        return (
            <div>
                <PlayListList {...this.preparePlaylistsLists()}></PlayListList>
            </div>
        );
    }

    preparePlaylistsLists() {
        return {
            userPlaylists: this.props.userPlaylists
        }
    }

}

{/*<Button type="button" className="btn btn-primary" onClick={this.createNewPlayList}>Add Playlist</Button>*/
}
{/*{this.createNewPlayList()}*/
}
{/*{this.printPlaylists()}*/
}

export default AppPlaylists;