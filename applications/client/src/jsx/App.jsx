var React = require('react');
var ReactDOM = require('react-dom');
var Button = require('react-bootstrap').Button;
var DefaultLayout = require('./DefaultLayout');
var PlayListListGroup = require('./PlayListListGroup');
var AlertDismissable = require('./AlertDismissable');
var TextModal = require('./TextModal');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isSpotifyLogged: false, playlists: '', showModal: false};
        this.logOut = this.logOut.bind(this);
        this.refreshPlaylists = this.refreshPlaylists.bind(this);
        this.getEveryPlaylist = this.getEveryPlaylist.bind(this);
        this.createPlaylist = this.createPlaylist.bind(this);
        this.createNewPlayList = this.createNewPlayList.bind(this);
    }

    logOut() {
        this.setState({
            isSpotifyLogged: false,
            playlists: ''
        });
        window.location.replace("/logout");
    }

    componentDidMount() {
        fetch('/spotify/islogged', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},

        })
            .then((result) => {
                    if (result.ok) {
                        this.setState({
                            isSpotifyLogged: true
                        });
                    } else {
                        isSpotifyLogged: false
                    }
                }
            )
    }

    logOutSpotify(event) {
        fetch('/spotify/logout', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
            .then((result) => {
                    this.setState({
                        isSpotifyLogged: false,
                        playlists: ''
                    });
                }
            )
    }

    triedToReLogIn() {

        var search = window.location.search;
        var params = new URLSearchParams(search);
        var testFlag = params.get('testFlag');
        if (testFlag) {
            return <h3> You're already logged in </h3>;
        } else
            return;
    };

    loginToSpotify(event) {
        window.location.replace("/spotify/login");
    }

    logoutToSpotify(event) {
        this.logOutSpotify();
    }

    renderLogInButton() {
        return <Button onClick={this.loginToSpotify}>Log In To SPOTIFY</Button>
    }

    refreshPlaylists() {
        // this.getEveryPlaylist();
        fetch('/spotify/user/playlist', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
            .then((result) => {
                    if (result.ok) {
                        result.json().then((data) => {
                            this.setState({playlists: data});
                        });
                    } else {
                        alert('error getting playlist');
                    }
                }
            )
    }

    getEveryPlaylist() {
        fetch('/spotify/user/playlist', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
            .then((result) => {
                    if (result.ok) {
                        result.json().then(function (data) {
                            this.setState({playlists: data});
                        });
                    } else {
                        alert('error getting playlist');
                    }
                }
            )
    }

    renderLogOutButton() {
        return <div>
            <Button onClick={this.logoutToSpotify.bind(this)}>Log Out To SPOTIFY</Button>
            <Button onClick={this.refreshPlaylists}>Refresh Playlists</Button>
        </div>
    }

    isSpotifyLogged() {
        // if(this.state.isSpotifyLogged){
        //     this.getEveryPlaylist();
        // }
        return this.state.isSpotifyLogged;
    }

    printPlaylists() {
        var elementToReturn = [];

        if (this.state.playlists){
            elementToReturn = (<PlayListListGroup playLists={this.state.playlists}> </PlayListListGroup>);
        }

        return elementToReturn;
    }

    createPlaylist(name){
        fetch('/spotify/createplaylist', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({name: name})
        })
            .then((result) => {
                    if (result.ok) {
                        // this.setState({
                        //     isSpotifyLogged: true
                        // });
                        // this.setState({showModal: true});
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


    createNewPlayList(){
        return <TextModal title={"Insert new Playlist's name"} action={this.createPlaylist}></TextModal>;
    }

    render() {
        // return <div>
        return <DefaultLayout>
            {this.triedToReLogIn()}

            <h1>this is the main page</h1>

            {this.isSpotifyLogged() ? this.renderLogOutButton() : this.renderLogInButton()}

            <button type="button" className="btn btn-primary" onClick={this.createNewPlayList} >Add Playlist </button>
            {this.createNewPlayList()}
            {this.printPlaylists()}
            {this.printPlaylists()}
            {/*<AlertDismissable />*/}

            {/*{this.state.playlists?             this.state.playlists.map(function(object, i){*/}
                {/*return (<div key={object.name} >{object.name}</div>);*/}
            {/*}) : undefined}*/}




            {/*<div className="row">*/}
                {/*<div className="leftcolumn">*/}
                    {/*<div className="card">*/}
                        {/*<h2>TITLE HEADING</h2>*/}
                        {/*<h5>Title description, Dec 7, 2017</h5>*/}
                        {/*<div className="fakeimg">Image</div>*/}
                        {/*<p>Some text..</p>*/}
                        {/*<p>Sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit,*/}
                            {/*sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,*/}
                            {/*quis nostrud exercitation ullamco.</p>*/}
                    {/*</div>*/}
                    {/*<div className="card">*/}
                        {/*<h2>TITLE HEADING</h2>*/}
                        {/*<h5>Title description, Sep 2, 2017</h5>*/}
                        {/*<div className="fakeimg">Image</div>*/}
                        {/*<p>Some text..</p>*/}
                        {/*<p>Sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit,*/}
                            {/*sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,*/}
                            {/*quis nostrud exercitation ullamco.</p>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {/*<div className="rightcolumn">*/}
                    {/*<div className="card">*/}
                        {/*<h2>About Me</h2>*/}
                        {/*<div className="fakeimg">Image</div>*/}
                        {/*<p>Some text about me in culpa qui officia deserunt mollit anim..</p>*/}
                    {/*</div>*/}
                    {/*<div className="card">*/}
                        {/*<h3>Popular Post</h3>*/}
                        {/*<div className="fakeimg"><p>Image</p></div>*/}
                        {/*<div className="fakeimg"><p>Image</p></div>*/}
                        {/*<div className="fakeimg"><p>Image</p></div>*/}
                    {/*</div>*/}
                    {/*<div className="card">*/}
                        {/*<h3>Follow Me</h3>*/}
                        {/*<p>Some text..</p>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {/*<div className="onecolumn">*/}
                    {/*<div className="card">*/}
                        {/*<h2>About Me</h2>*/}
                        {/*<div className="fakeimg">Image</div>*/}
                        {/*<p>Some text about me in culpa qui officia deserunt mollit anim..</p>*/}
                    {/*</div>*/}
                    {/*<div className="card">*/}
                        {/*<h3>Popular Post</h3>*/}
                        {/*<div className="fakeimg"><p>Image</p></div>*/}
                        {/*<div className="fakeimg"><p>Image</p></div>*/}
                        {/*<div className="fakeimg"><p>Image</p></div>*/}
                    {/*</div>*/}
                    {/*<div className="card">*/}
                        {/*<h3>Follow Me</h3>*/}
                        {/*<p>Some text..</p>*/}
                    {/*</div>*/}
                {/*</div>*/}
            {/*</div>*/}


        </DefaultLayout>
    }
}


ReactDOM.render(React.createElement(App), document.getElementById('content'));