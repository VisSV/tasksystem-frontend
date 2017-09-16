import React, { Component } from 'react';
import axios from 'axios';
import config from './config';

class ServerStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serverAlive: false
    };

    this.ping = this.ping.bind(this);
  }

  componentDidMount() {
    // 30 second timer
    this.timer = setInterval(this.ping, 30 * 1000);
    this.ping();
  }

  componentWillUnmount() {
    clearInterval(this.timer); // no more timing!
  }

  ping() {
    var self = this;
    // ping the server
    //this.setState({serverAlive: true});
    axios.get(config.httpaddr + '/')
      .then(function(res) {
        self.setState({serverAlive: true});
      })
      .catch(function(err) {
        if(err.response) {
          self.setState({serverAlive: true}); // we just need a response
        } else {
          self.setState({serverAlive: false});
        }
      });
  }

  render() {
    var statusString = this.state.serverAlive ? "Online" : "Offline";
    return (
      <div className="ServerStatus">
        <label>Server status:</label>
        <div className={"status-icon " + (this.state.serverAlive ? "server-online" : "server-offline")}></div>
        <p>{statusString}</p>
      </div>
    );
  }
}

export default ServerStatus;

