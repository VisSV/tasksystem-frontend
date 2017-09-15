
import React, { Component } from 'react';

class LoadingScreen extends Component {
  render() {
    return (
      <div className="LoadingScreen">
        <div className="spinner">
          <div className="spinner-stage-1"></div>
          <div className="spinner-stage-2"></div>
          <div className="spinner-stage-3"></div>
          <div className="spinner-stage-4"></div>
          <div className="spinner-stage-5"></div>
          <div className="spinner-stage-6"></div>
          <div className="spinner-stage-7"></div>
          <div className="spinner-stage-8"></div>
          <div className="spinner-stage-9"></div>
          <div className="spinner-stage-10"></div>
          <div className="spinner-stage-11"></div>
          <div className="spinner-stage-12"></div>
        </div>
        <p className="spinner-text">Loading...</p>
      </div>
    );
  }
}

export default LoadingScreen;

