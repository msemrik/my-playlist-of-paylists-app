import React from 'react';

var Alert = require('react-bootstrap').Alert;
var Button = require('react-bootstrap').Button;


class AlertDismissable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {alert: this.props.alert};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({alert: nextProps.alert});
    }

    handleHide = () => {
        // this.setState({show: false});
        this.props.resetAlert();
    };
    // handleShow = () => {
        // this.setState({show: true});
    // };

    render() {


        return (
            <>
                {this.state.alert.error.toShow &&
                <div className={"alert-dismisable-container"}>

                    <Alert show={this.state.show} variant="danger">
                        <Alert.Heading>Oops! We found an error</Alert.Heading>
                        <p>
                            {this.state.alert.error.text}
                        </p>
                        <hr/>
                        <div className="d-flex justify-content-end">
                            <Button onClick={this.handleHide} variant="outline-danger">
                                Close :´(
                            </Button>
                        </div>
                    </Alert>
                </div>
                }

                {this.state.alert.message.toShow &&
                <div className={"alert-dismisable-container"}>

                    <Alert show={this.state.show} variant="success">
                        <Alert.Heading>Hey you!</Alert.Heading>
                        <p>
                            {this.state.alert.message.text}

                        </p>
                        <hr/>
                        <div className="d-flex justify-content-end">
                            <Button onClick={this.handleHide} variant="outline-success">
                                Close :)
                            </Button>
                        </div>
                    </Alert>
                </div>
                }
            </>
        );
    }
}

export default AlertDismissable;