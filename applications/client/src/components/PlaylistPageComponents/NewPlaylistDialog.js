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
                <Button className={"playlist-list-button-div-button"} onClick={() => this.setState({lgShow: true})}>
                    Create New Playlist
                </Button>

                <Modal
                    size="lg"
                    show={this.state.lgShow}
                    onHide={lgClose}
                >

                    <Modal.Header closeButton>
                        <Modal.Title className={"playlist-add-playlist-title-text"}>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input id="name" type="text" className={"playlist-add-playlist-input-text"}
                               value={this.state.name} onChange={this.handleNameChange}/>
                        <br/>
                        <br/>
                        <div className={"button-div"}>
                            <button className={"playlist-add-playlist-cancel-button"} onClick={lgClose}>
                                Close
                            </button>
                            <button className={"playlist-list-button-div-button"} onClick={this.handleClick}>
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