var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;


class TextModal extends React.Component {
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
        let lgClose = () => this.setState({ lgShow: false });

        return (
            <ButtonToolbar>
                <Button onClick={() => this.setState({ lgShow: true })}>
                    Large modal
                </Button>

                <Modal
                    size="lg"
                    show={this.state.lgShow}
                    onHide={lgClose}
                    aria-labelledby="example-modal-sizes-title-lg">

                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input id="name" type="text"  value={this.state.name} onChange={this.handleNameChange} />
                        <br/>
                        <button type="button" className="btn btn-secondary" onClick={lgClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={this.handleClick}>Save</button>
                    </Modal.Body>
                </Modal>
            </ButtonToolbar>
        );
    }
}

module.exports = TextModal;