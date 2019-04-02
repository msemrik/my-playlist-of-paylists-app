import React from 'react';

var Alert = require('react-bootstrap').Alert;
var Button = require('react-bootstrap').Button;


class AlertDismissable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {alert: this.props.alert};
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.showLoadingModal === true && nextProps.showLoadingModal === true) {
            this.state = {alert: {error: {}, message: {}}};
        } else {
            this.state = {alert: this.props.alert}
        }

        // if(nextProps.alert.error.toShow === false && nextProps.alert.message.toShow === false){
        //     this.setState({alert: nextProps.alert});
        // } else if(){
        //     this.setState({alert: nextProps.alert});
        // }


    }

    handleHide = () => {
        this.props.resetAlert();
    };

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