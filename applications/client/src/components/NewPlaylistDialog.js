import './NewPlaylistDialog.css';
var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Button = require('react-bootstrap').Button;

var Modal = require('react-bootstrap').Modal;

class NewPlaylistDialog extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            lgShow: false, name: ''
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.action(this.state.name);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    render() {
        let lgClose = () => this.setState({lgShow: false});

        return (
            <ButtonToolbar>
                <Button className={"SpotifyButton"} onClick={() => this.setState({lgShow: true})}>
                    Create New Playlist
                </Button>

                <Modal
                    size="lg"
                    show={this.state.lgShow}
                    onHide={lgClose}
                    aria-labelledby="example-modal-sizes-title-lg">

                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg" className={"SpotifyTitleText"}>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input id="name" type="text" className={"playlist-text"} value={this.state.name} onChange={this.handleNameChange}/>
                        <br/>
                        <br/>
                        {/*<button type="button" className="btn btn-secondary" onClick={lgClose}>Close</button>*/}
                        {/*<button type="button" className="btn btn-primary" onClick={this.handleClick}>Save</button>*/}
                        <div className={"button-div"}>
                            <button className={"SpotifyCancelButton"} onClick={lgClose}>
                                Close
                            </button>
                            <button className={"SpotifyButton"} onClick={this.handleClick}>
                                Create
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </ButtonToolbar>
        );
    }
}

export default NewPlaylistDialog;