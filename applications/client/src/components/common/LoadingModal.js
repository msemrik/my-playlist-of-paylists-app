import './LoadingModal.css';

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

var Modal = require('react-bootstrap').Modal;

var lastTimeOpened;

class LoadingModal extends React.Component {
    constructor(props, context) {
        super(props, context);


        this.state = {
            lgShow: this.props.showLoadingModal, name: ''
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.showLoadingModal !== this.props.showLoadingModal)
            if (nextProps.showLoadingModal) {
                lastTimeOpened = new Date();
                this.setState({lgShow: nextProps.showLoadingModal});
            } else {
                var timeElapsed = new Date() - lastTimeOpened;
                if (Math.floor((timeElapsed / 1000)) < 3) {
                    setTimeout(() => this.setState({lgShow: nextProps.showLoadingModal}), 3000 - timeElapsed)
                } else {
                    this.setState({lgShow: nextProps.showLoadingModal});
                }
            }


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
                {/*<Button className={"playlist-list-button-div-button"} onClick={() => this.setState({lgShow: true})}>*/}
                {/*Create New Playlist*/}
                {/*</Button>*/}

                <Modal
                    size="lg"
                    show={this.state.lgShow}
                    // onHide={this.lgClose}
                >

                    <div className={"modal-loading-div"}>
                        <img alt="" className={"modal-loading-div-gif"} src="loading.gif"/>
                    </div>
                </Modal>
            </ButtonToolbar>
        );
    }
}

export default LoadingModal;