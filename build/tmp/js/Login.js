var React = require('react');

var ReactDOM = require('react-dom');

var Button = require('react-bootstrap').Button;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      error: false,
      errorDescription: ''
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  handlePassChange(event) {
    this.setState({
      password: event.target.value
    });
  }

  handleError(message) {
    this.setState({
      error: true,
      errorDescription: message
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('/login', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "username": this.state.name,
        "password": this.state.password
      })
    }).then(result => {
      if (result.ok) {
        window.location.replace("/");
      } else {
        result.json().then(result => {
          console.log(result);
          this.handleError(result.message);
        });
      }
    });
  }

  createNewAccount() {
    window.location.replace("/signup");
  }

  render() {
    return React.createElement("div", null, this.state.error ? this.state.errorDescription : null, React.createElement("form", {
      onSubmit: this.handleSubmit
    }, React.createElement("label", null, "Username:", React.createElement("input", {
      id: "username",
      type: "text",
      value: this.state.name,
      onChange: this.handleNameChange
    })), React.createElement("label", null, "Password:", React.createElement("input", {
      id: "password",
      type: "text",
      value: this.state.password,
      onChange: this.handlePassChange
    })), React.createElement("input", {
      type: "submit",
      value: "Submit"
    })), React.createElement(Button, {
      onClick: this.createNewAccount
    }, "Create New Account"));
  }

}

ReactDOM.render(React.createElement(Login), document.getElementById('content'));