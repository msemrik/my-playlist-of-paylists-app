import React from "react";
import PlaylistItem from "../PlaylistPageComponents/PlaylistItem";

class PlaylistPageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedConfiguredPlaylist: ''};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedConfiguredPlaylist !== this.props.selectedConfiguredPlaylist)
            this.setState({selectedConfiguredPlaylist: nextProps.selectedConfiguredPlaylist});
    }

    render() {
        return (
            <section className={"playlist-list-section"}>
                <div className={"playlist-list-title-div"}>
                    <h1 className={"playlist-list-title-text"}>
                        {this.props.playlistPageTitle}
                    </h1>
                    <div className={"playlist-list-button-div"}>
                        {this.props.playlistPageButton}
                    </div>
                </div>
                <div className={"playlist-list-div"}>
                    <table className={"playlist-list-div-table"}>
                        <tbody className={"playlist-list-div-table-tbody"}>
                        {this.props.playlistsToShow ?


                            (this.props.isConfiguredPlaylist && this.props.playlistsToShow.length === 0) ?
                                <h1 className={"playlist-list-title-text"}>
                                    <br/>
                                    You do not have configured playlists. Start by Clicking on Create New Playlist ;)
                                </h1> :

                                this.props.playlistsToShow.map(playlist =>

                                    <PlaylistItem {...this.getPlaylistItemConfiguration(playlist)}/>
                                ).reduce((prev, curr) => [prev, ' ', curr], '')

                            :

                            undefined
                        }
                        </tbody>
                    </table>
                </div>
            </section>
        );
    };

    getPlaylistItemConfiguration(playlist) {
        return {
            isConfiguredPlaylist: this.props.isConfiguredPlaylist,
            isSelected: playlist.id === this.state.selectedConfiguredPlaylist.id ? true : false,
            playlist: playlist,
            clickAction: (playlist) => this.props.itemActionOnClick(playlist)
        }
    }
}

export default PlaylistPageList;
