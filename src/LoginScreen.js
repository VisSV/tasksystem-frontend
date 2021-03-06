import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

import config from './config';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.processLogin = this.processLogin.bind(this);
    this.state = {
      isLoading: false,
      loginErrors: []
    };
  }

  processLogin(e) {
    var self = this;
    e.preventDefault();
    var data = {
      username: e.target.username.value,
      password: e.target.password.value
    };
    self.setState({isLoading: true});
    axios.post(config.httpaddr + '/api-token-auth/', data)
      .then(function(res) {
        self.setState({loginErrors: [], isLoading: false});
        self.props.cortex.merge({
          status: "loading",
          authToken: res.data.token
        });
      })
      .catch(function(err) {
        console.log(err);
        var res = err.response.data;
        var errs = _.keys(res).map(function(k) {
          return res[k].map(function(err) {
            return k + ': ' + err;
          });
        });
        errs = _.flattenDeep(errs);
        self.setState({loginErrors: errs, isLoading: false});
      });
  }

  render() {
    var errorList = this.state.loginErrors.map(function(err, i) {
      return <li key={i}>{err}</li>
    });
    if(errorList.length > 0) {
      var errDisplay = (
        <div className="alert alert-error">
          <p><strong>Login error</strong></p>
          <ul>
            {errorList}
          </ul>
        </div>
      );
    }
    if(this.state.isLoading) {
      var spinner = <div className="loading-spinner"></div>;
    }
    return (
      <div className="LoginScreen">
        <h1>Please log in</h1>
        {errDisplay}
        <form onSubmit={this.processLogin}>
          <label>Username: <input type="text" name="username" className ="needMargin"/></label>
          <label>Password: <input type="password" name="password" className ="needMargin"/></label>
          <button type="submit" disabled={this.state.isLoading}>Login {spinner}</button>
        </form>
      </div>
    );
  }
}

export default LoginScreen;

