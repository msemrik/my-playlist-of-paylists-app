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
        this.lgClose();
        this.props.action(this.state.name);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    lgClose = () => this.setState({lgShow: false, name: ''});

    render() {
        return (
            <ButtonToolbar>
                <Button className={"playlist-list-button-div-button"} onClick={() => this.setState({lgShow: true})}>
                    Create New Playlist
                </Button>

                <Modal
                    size="lg"
                    show={this.state.lgShow}
                    onHide={this.lgClose}
                >

                    <div className={"modal-div"}>
                        <h3 className={"modal-div-title"}>Create New Playlist</h3>
                        <form className={"modal-div-form"}>
                            <div className={"modal-div-form-item-group"}>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text modal-div-form-item-group-input"
                                              id="basic-addon1">Playlist Name</span>
                                    </div>
                                    <input type="text" className="form-control" aria-describedby="basic-addon1"
                                           value={this.state.name} onChange={this.handleNameChange}/>
                                </div>
                            </div>
                            <div className={"modal-div-form-item-group button-item-group"}>
                                <button className={"playlist-add-playlist-cancel-button"} onClick={this.lgClose}>
                                    Close
                                </button>
                                <button className={"playlist-add-playlist-create-button"} onClick={this.handleClick}>
                                    Create New Playlist
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </ButtonToolbar>
        );
    }
}

export default NewPlaylistDialog;