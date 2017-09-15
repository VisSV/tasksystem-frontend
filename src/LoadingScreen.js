import React, { Component } from 'react';

import Spinner from './Spinner';

class LoadingScreen extends Component {
  render() {
    return (
      <div className="LoadingScreen">
        <Spinner />
        <p className="spinner-text">Loading...</p>
      </div>
    );
  }
}

export default LoadingScreen;

