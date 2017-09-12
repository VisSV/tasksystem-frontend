import React, { Component } from 'react';
import Cortex from 'cortexjs';
import axios from 'axios';
import moment from 'moment';

import './App.css';
import config from './config';

import LoadingScreen from './LoadingScreen';
import TaskSelector from './TaskSelector';
import LoginScreen from './LoginScreen';
import ErrorScreen from './ErrorScreen';

function convertTask(task) {
  task.starttime = moment(task.date + ' ' + task.starttime);
  task.endtime = moment(task.date + ' ' + task.endtime);
  task.date = moment(task.date); // set this last so we don't break nice things
}

class App extends Component {
  constructor(props) {
    super(props);

    // initialize the state and set up the re-rendering callback
    var initState = {
      status: "initializing",
      authToken: null,
      errText: null,
      availableTasks: [],
      selectedTasks: []
    };
    var cortex = new Cortex(initState, (updatedCortex) => {
      this.setState({cortex: updatedCortex});
    });
    this.state = {cortex: cortex};
  }

  // TODO: load the user's available and selected tasks
  loadInitialData() {
    const self = this;
    var reqConfig = {
      headers: {
        'Authorization': 'Token ' + this.state.cortex.authToken.val()
      }
    };
    var availLoad = axios.get('http://' + config.hostname + '/available_tasks', reqConfig);
    var myTasksLoad = axios.get('http://' + config.hostname + '/selected_tasks', reqConfig);
    axios.all([availLoad, myTasksLoad])
      .then(axios.spread(function(avails, mine) {
        mine.data.forEach(convertTask);
        avails.data.forEach(convertTask);
        self.state.cortex.set({
          status: "loaded", 
          availableTasks: avails.data, 
          selectedTasks: mine.data
        });
      }))
      .catch(function(err) {
        // It's possible that we just need to log in...
        if(err.response) {
          if(err.response.status === 401 || err.response.status === 403) {
            self.state.cortex.set({
              status: "unauthorized",
              authToken: null
            });
          } else {
            self.state.cortex.set({
              status: "error",
              errText: err.response.statusText
            });
          }
        } else {
          self.state.cortex.set({
            status: "error",
            errText: "server error"
          });
        }
      });
  }

  componentDidMount() {
    this.loadInitialData();
  }

  componentDidUpdate() {
    if(this.state.cortex.status.val() === "loading")
      this.loadInitialData();
  }

  render() {
    var screen;
    switch(this.state.cortex.status.getValue()) {
      case "initializing":
      case "loading":
        screen = <LoadingScreen />;
        break;
      case "unauthorized":
        screen = <LoginScreen cortex={this.state.cortex} />;
        break;
      case "error":
        screen = <ErrorScreen err={this.state.cortex.errText.val()} />;
        break;
      case "loaded":
        screen = <TaskSelector 
                    availableTasks={this.state.cortex.availableTasks}
                    selectedTasks={this.state.cortex.selectedTasks} />
        break;
      default:
        screen = <ErrorScreen err={"Unknown state: " + this.state.cortex.status.val()} />;
        break;
    };
    return (
      <div className="App">
        {screen}
      </div>
    );
  }
}

export default App;
