import './PlayListList.css';
import '../spotify.css';
import NewPlaylistDialog from "./NewPlaylistDialog";

var Button = require('react-bootstrap').Button;

var React = require('react');


class PlayListList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {playlists: props.userPlaylists, spotifyPlaylistsToBeShown: ''};
        this.savePlaylistsConfiguration = this.savePlaylistsConfiguration.bind(this);
    }

    createPlaylist(name) {
        fetch('/spotify/createplaylist', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({name: name})
        })
            .then((result) => {
                    if (result.ok) {
                        console.log('success createplaylist');
                        alert('success createplaylist');
                    } else {
                        // isSpotifyLogged: false
                        console.log('failed createplaylist');
                        alert('failed createplaylist');
                    }
                }
            )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({playlists: nextProps.userPlaylists});

    }

    render() {
        return (
            <div className={"playlistlists"}>
                <div className={"configuredplaylistlists"}>
                    {this.printConfiguredPlaylist()}
                </div>
                <div className={"spotifyplaylistlists"}>
                    {this.printPlaylistPlaylists()}
                </div>
            </div>);
    }

    printConfiguredPlaylist() {
        return (
            <section className={"PlaylistSection"}>
                <div className={"SpotifyTitleDiv"}>
                    <h1 className={"SpotifyTitleText"}>
                        Your configured playlists
                    </h1>
                    <div className={"SpotifyAddPlayListDiv"}>
                        <NewPlaylistDialog title={"Insert new Playlist's name"}
                                           action={this.createPlaylist}></NewPlaylistDialog>
                    </div>
                </div>
                <div className={"PlaylistsDiv"}>
                    <table className={"PlaylistTable"}>
                        <tbody className={"PlaylistTbody"}>
                        {this.state.playlists.configuredPlaylists ? this.state.playlists.configuredPlaylists.map(playlist =>

                                <tr id={playlist.id} className={"PlaylistRow"} onClick={
                                    () => this.updateSpotifyPlaylistsToBeShown(playlist)}>
                                    <td className={"PlaylistImageColumn"}>
                                        <img alt="Application image"
                                             src="data:image/png;base64,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"
                                             id="IMG_7"/>
                                    </td>
                                    <td className={"PlaylistName"}>
                                        <strong
                                            // id="STRONG_9"
                                        >
                                            {playlist.name}
                                        </strong>
                                        <br/>
                                        Number of tracks: {playlist.tracks.total}
                                    </td>
                                </tr>
                            ).reduce((prev, curr) => [prev, ' ', curr]) :
                            undefined
                        }
                        </tbody>
                    </table>
                </div>
            </section>)
            ;
    }


    printPlaylistPlaylists() {
        return (
            <section className={"PlaylistSection"}>
                <div className={"SpotifyTitleDiv"}>
                    <h1 className={"SpotifyTitleText"}>
                        Your Spotify playlists
                    </h1>
                    <div className={"SpotifyAddPlayListDiv"}>
                        <Button className={"SpotifyButton"} onClick={
                            () => this.savePlaylistsConfiguration()
                        }>
                            Save Changes
                        </Button>
                    </div>
                </div>
                <div className={"PlaylistsDiv"}>
                    <table className={"PlaylistTable"}>
                        <tbody className={"PlaylistTbody"}>
                        {this.state.spotifyPlaylistsToBeShown ? this.state.spotifyPlaylistsToBeShown.map(playlist =>
                                <tr id={playlist.id} className={"PlaylistRow"} onClick={() => this.setState({})}>
                                    <td className={"PlaylistImageColumn"}>
                                        <img alt="Application image"
                                             src={playlist.images[2] ? playlist.images[2].url : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAKu2lDQ1BJQ0MgUHJvZmlsZQAASImVlwdQk9kWx+/3pYeEFoiAlNA70qv0GkBBOohKSEIIJYQUVOyKuIJrQUQEy4osRRRclSKLiohiYRFQwL5BFgV1XSyIisr7gEd4783befP+M3fyy5nznZxzc+/M/wOANMLg89NgeQDSeSJBmL8XLSY2joaTAAjgAB7YATMGU8j3DA0NBn+rj/1INqK75tO1/j7vv0qBxRYyAYBCEU5kCZnpCJ9HVheTLxABgMpB4rqrRfxprkJYSYA0iHDLNHNmuXuaE2f5j5mciDBvhD8BgCcxGAIOACQ0EqdlMTlIHZIewpY8FpeHcATCbsxkBgvhQoTN0tMzprkVYaPEf6nD+beaidKaDAZHyrOzzAjvwxXy0xhr/8/t+N9KTxPP/YYOskjJgoAw5NMA2bOq1IwgKfMSl4bMMZc1kz/DyeKAyDlmCr3j5pjF8AmaY3FqpOccMwTzz3JF9Ig5FmSESeuzhb7h0vpserC0h7SlUk7i+tHnODs5InqOs7hRS+dYmBoeNJ/jLY0LxGHSnpMEftIZ04XzvTEZ8z2IkiMC5nuLkfbAYvv4SuO8SGk+X+QlrclPC5Xms9P8pXFhVrj0WRFywOY4hREYOl8nVLo/IAIkAzHgARZgAwFIBBkgDYgADfgALhACPvKNAZDjIWKvEU0P4Z3BXyvgcpJFNE/kFrFpdB7TwoxmbWllD8D0nZz9y99TZ+4aRL01H8tsBcApDwly5mMMXQAuPAeA8nE+pvsOOS57AbjYzRQLsmZj08cWYAARyAEloAo0gS4wAubAGtgDF+ABfEEgCEEmiQUrAROZJx2ZZDVYD7aAXJAP9oIDoAQcAydAFTgNzoJG0AKugOvgNugGfeARkIBh8AqMgY9gEoIgHESGKJAqpAXpQ6aQNeQIuUG+UDAUBsVCCRAH4kFiaD20DcqHCqAS6DhUDf0CXYCuQDehHugBNAiNQu+gLzAKJsFKsAZsAC+CHWFPOAiOgFfAHDgTzoZz4N1wMVwGn4Ib4CvwbbgPlsCv4HEUQMmgqChtlDnKEeWNCkHFoZJQAtRGVB6qCFWGqkU1ozpQd1ES1GvUZzQWTUHT0OZoF3QAOhLNRGeiN6J3oUvQVegGdDv6LnoQPYb+jiFj1DGmGGcMHROD4WBWY3IxRZgKTD3mGqYPM4z5iMViqVhDrAM2ABuLTcGuw+7CHsHWYVuxPdgh7DgOh1PFmeJccSE4Bk6Ey8Udwp3CXcb14oZxn/AyeC28Nd4PH4fn4bfii/An8ZfwvfgX+EmCPEGf4EwIIbAIawl7COWEZsIdwjBhkqhANCS6EiOIKcQtxGJiLfEa8THxvYyMjI6Mk8wyGa7MZplimTMyN2QGZT6TFEkmJG9SPElM2k2qJLWSHpDek8lkA7IHOY4sIu8mV5Ovkp+SP8lSZC1k6bIs2U2ypbINsr2yb+QIcvpynnIr5bLliuTOyd2Rey1PkDeQ95ZnyG+UL5W/ID8gP65AUbBSCFFIV9ilcFLhpsKIIk7RQNFXkaWYo3hC8ariEAVF0aV4U5iUbZRyyjXKsBJWyVCJrpSilK90WqlLaUxZUdlWOUp5jXKp8kVlCRVFNaDSqWnUPdSz1H7qlwUaCzwXsBfsXFC7oHfBhMpCFQ8VtkqeSp1Kn8oXVZqqr2qq6j7VRtUnamg1E7VlaqvVjqpdU3u9UGmhy0LmwryFZxc+VIfVTdTD1Nepn1DvVB/X0NTw1+BrHNK4qvFak6rpoZmiWah5SXNUi6LlpsXVKtS6rPWSpkzzpKXRimnttDFtde0AbbH2ce0u7UkdQ51Ina06dTpPdIm6jrpJuoW6bbpjelp6S/TW69XoPdQn6DvqJ+sf1O/QnzAwNIg22GHQaDBiqGJIN8w2rDF8bEQ2cjfKNCozumeMNXY0TjU+YtxtApvYmSSblJrcMYVN7U25pkdMe8wwZk5mPLMyswFzkrmneZZ5jfmgBdUi2GKrRaPFm0V6i+IW7VvUsei7pZ1lmmW55SMrRatAq61WzVbvrE2smdal1vdsyDZ+Nptsmmze2prasm2P2t63o9gtsdth12b3zd7BXmBfaz/qoOeQ4HDYYcBRyTHUcZfjDSeMk5fTJqcWp8/O9s4i57POf7mYu6S6nHQZWWy4mL24fPGQq44rw/W4q8SN5pbg9pObxF3bneFe5v7MQ9eD5VHh8cLT2DPF85TnGy9LL4FXvdeEt7P3Bu9WH5SPv0+eT5evom+kb4nvUz8dP45fjd+Yv53/Ov/WAExAUMC+gAG6Bp1Jr6aPBToEbghsDyIFhQeVBD0LNgkWBDcvgZcELtm/5PFS/aW8pY0hIIQesj/kSahhaGbor8uwy0KXlS57HmYVtj6sI5wSvir8ZPjHCK+IPRGPIo0ixZFtUXJR8VHVURPRPtEF0ZKYRTEbYm7HqsVyY5vicHFRcRVx48t9lx9YPhxvF58b37/CcMWaFTdXqq1MW3lxldwqxqpzCZiE6ISTCV8ZIYwyxngiPfFw4hjTm3mQ+YrlwSpkjbJd2QXsF0muSQVJIxxXzn7OaLJ7clHya643t4T7NiUg5VjKRGpIamXqVFp0Wl06Pj0h/QJPkZfKa8/QzFiT0cM35efyJZnOmQcyxwRBggohJFwhbBIpIeanU2wk3i4ezHLLKs36tDpq9bk1Cmt4azrXmqzdufZFtl/2z+vQ65jr2tZrr9+yfnCD54bjG6GNiRvbNuluytk0vNl/c9UW4pbULb9ttdxasPXDtuhtzTkaOZtzhrb7b6/Jlc0V5A7scNlx7Af0D9wfunba7Dy083seK+9WvmV+Uf7XXcxdt360+rH4x6ndSbu79tjvOboXu5e3t3+f+76qAoWC7IKh/Uv2NxTSCvMKPxxYdeBmkW3RsYPEg+KDkuLg4qZDeof2HvpaklzSV+pVWndY/fDOwxNHWEd6j3ocrT2mcSz/2JefuD/dP+5/vKHMoKzoBPZE1onn5VHlHT87/lxdoVaRX/GtklcpqQqraq92qK4+qX5yTw1cI64ZPRV/qvu0z+mmWvPa43XUuvwz4Iz4zMtfEn7pPxt0tu2c47na8/rnD9dT6vMaoIa1DWONyY2SptimnguBF9qaXZrrf7X4tbJFu6X0ovLFPZeIl3IuTV3Ovjzeym99fYVzZahtVdujqzFX77Uva++6FnTtxnW/61c7PDsu33C90XLT+eaFW463Gm/b327otOus/83ut/ou+66GOw53mrqdupt7Fvdc6nXvvXLX5+71e/R7t/uW9vX0R/bfH4gfkNxn3R95kPbg7cOsh5OPNj/GPM57Iv+k6Kn607LfjX+vk9hLLg76DHY+C3/2aIg59OoP4R9fh3Oek58XvdB6UT1iPdIy6jfa/XL5y+FX/FeTr3P/VPjz8BujN+f/8vircyxmbPit4O3Uu13vVd9XfrD90DYeOv70Y/rHyYm8T6qfqj47fu74Ev3lxeTqr7ivxd+MvzV/D/r+eCp9aorPEDBmrAAKWXBSEgDvKgEgxyLeAfHVRNlZzzwjaNbnzxD4O5711TNCnEulBwCRmwEIRjzKUWTpb5711tOWKcIDwDY20vVPCZNsrGdrkRDnifk0NfVeAwBcMwDfBFNTk0empr6VI80+AKA1c9arTwuLvMEUGFItCPWd7aXgP/UPFMQLK5LVvSYAAAHVaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+MTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj4yPC90aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoC2IAFAAAFGklEQVR4Ae2aZ0/lPBCFs/TeRBMg/v+f4gtCCCF67/vu41fnanB8E+cmzk2WHclyits5Mx6P4/w6Ojr6nf1gmfjB2B30H0/AVJsW8Pb2lj0/P2ePj48Z119fX/9rYWIim5uby+bn512amZlpbVhJCRBgQL+8vAwA++gg4unpySW9s4RwnUoaJeDj48MBfXh4KAQcAwbCSNfX1654KkJqESDAaI/Bcp9KUhFSiQBMlYFoHqcEXEZkU4QUEmABo+X39/eycY3t/aiE5AgA9P39fXZ3d9dpwGVM+4RMT09nOzs7mb/C5Aig4dfX1+zz87Osj968B/Ty8nI2NZWHm3sy8WdN3t7eduBYxrAEzH+c830UpmdnZ7OlpaVscXExCFxtOgIAenZ25p5RAbZgjbS5udkbMhYWFhxgMKBIKyhRyzPPDw4OXJlfbIYuLi6cpm0FzMWSYd9hDURz+ArIG6fEgAY8vs3K+vp6RnIWwJz3BZC3t7cu+WRwv7q66pLIgN1QO367de/RLEERyglpGoWgGBQUM21zPiA0wFgyYJmOSbDelAAaTTOnyX2pCtrWjyLAVigig4HiP0gig6ApZIK2zdB1StC2v8oE2MqxZFBHTqiIDKYWGlayfXFdR9N+W7qvRYAaIS8ig/cWFCTgLxRZEqQwn/0ghXopQNOupDEC1CB5FTJsPV2nBq1+yJMQYDsIkcHywxy3onKx3tvWrXOdnAA7OAtSgQjveX5ycpJbq23dVNff1RDRC3N5a2urMLwsawbABF+Sq6ursYCn/8oWsLKy4hwaSx07rsvLy5ECIDlABkE745JKFqC1WYMlItvf38/29vb0aKQcixiXVCIA8w8JRPhOLVSui88qEUAoOkwgoY8STYBv/j5Yvun3UaIJCJm/nbtEcn2UaALw/lYAf3NzM3hEHE/qm0QRADB/jhOxsdOz4pex77p6HUVAyPwBz1puv7T00Q9EEeCbP6DZ0SE2iPkrCcD8/W0q5i8REdyHyqpcV/NSCwiZvyWg736glIAi80ervh8IEdZV7TOuQgJCJm21L2DWD/RtJSgkIKTNycnJ3Hpv/QARo+8zRFQX80ICfPMHAKQcHh66bwIC6vuBPkWFQ0O3kPlbDerzN+bP+SFLo3aELIf6s8PW6eL1UAI4+YkR5rw/7/37mHbGVWboFAiZMXPdRn5Fg+Z0tg8StADmNlPACsA5Qda2eGNjI1fGlufbQRtnhbbPUa6dBXAwYYWd3vn5+bfDRS1/EMFB6PHxsSPELoG2jb6ExU7NDBZQEoHkGV5/bW3NHXjqvXKmBAlrwSLsFyOsCGuJnTJqs61cFu4sgPmuB/4AAHh6ejrY/PjvuZfFcCxtpavOEOWwiiGOADS1u7tbO4Dx44EuTgPA26/Yg1WAF5zW1Dn08P1BaCWxFtLmNRYONnsiRf/fXf2fBwpwMGeCGfvdr2zAlCVpOpGTqrRR1kfV9/TPWaRM3q+fI0AFRiUC4uhQgh+wDlbPU+dlwNX/UAJUoCoRWA3/FhFJUtdfYdRuqjwWuPovJUAFqxDB0gcRpLZWgqrAhSuaAFWoQgR1fMeodprKRwWu/isToIpViVC9pvK6wDWOkQlQA20T0RRwjb82AWooNRFNA9e4GyNADTZNRCrgGm/jBKjhukSkBq5xJiNAHcQQQRjOr3FIW8A1vuQEqCNLBN8W2D5L+CWfk2b2DpRrU9zv8m122LW+BrvBrg2srfH8I6Atprvaz38/Ljd1LvV4jAAAAABJRU5ErkJggg=="}
                                             className={"PlaylistImage"}/>
                                    </td>
                                    <td className={"PlaylistName"}>
                                        <strong
                                            // id="STRONG_9"
                                        >
                                            {playlist.name}
                                        </strong>
                                        <br/>
                                        Number of tracks: {playlist.tracks.total}
                                    </td>
                                    <td className={"PlaylistCheckboxColumn"}>
                                        <div id="DIV_1">
                                            <label id="LABEL_2">
                                                <input type="checkbox" name="notify-product-news:email" value="1"
                                                       checked="checked"
                                                       onChange={() => this.changePlaylistChecked(playlist)}
                                                       class="INPUT_3"/><span
                                                className={playlist.selected ? "CheckBox checked" : "CheckBox"}></span>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            ).reduce((prev, curr) => [prev, ' ', curr]) :
                            undefined
                        }
                        </tbody>
                    </table>
                </div>
            </section>)
            ;
    }

    changePlaylistChecked(playlist) {
        playlist.selected = !playlist.selected;
    }

    updateSpotifyPlaylistsToBeShown(playlist) {
        this.setState({
            selectedConfiguredPlaylist: playlist,
            spotifyPlaylistsToBeShown: this.state.playlists.spotifyPlaylists
        })
    }

    savePlaylistsConfiguration() {
        var playlistToUpdate = this.state.selectedConfiguredPlaylist;
        playlistToUpdate.playlistsConfigured = [];
        this.state.spotifyPlaylistsToBeShown.filter((playlist) => playlist.selected).map(playlist => {
            playlistToUpdate.playlistsConfigured.push(playlist.id);
        });

        fetch('/updateplaylist', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({playlistToUpdate: playlistToUpdate})
        })
            .then((result) => {
                    if (result.ok) {
                        console.log('success updatedplaylist');
                        alert('success updatedplaylist');
                    } else {
                        // isSpotifyLogged: false
                        console.log('failed updatedplaylist');
                        alert('failed updatedplaylist');
                    }
                }
            )

        console.log(playlistToUpdate);
    }

}


export default PlayListList;