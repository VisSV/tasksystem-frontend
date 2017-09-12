import React, { Component } from 'react';

class ErrorScreen extends Component {
  render() {
    return (
      <div className="ErrorScreen">
        <p className="alert alert-error">
          <strong>Error</strong> {this.props.err}
        </p>
      </div>
    );
  }
}

export default ErrorScreen;

