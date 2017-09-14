import React, { Component } from 'react';
import Cortex from 'cortexjs';
import axios from 'axios';
import moment from 'moment';
import { WebSocketBridge } from 'django-channels';

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
      status: "unauthorized",
      authToken: null,
      //status: "loading",
      //authToken: '3f5fbf167ddda607626889ce07d1c401abeddc0f',
      errText: null,
      availableTasks: {},
      selectedTasks: {}
    };
    var cortex = new Cortex(initState, (updatedCortex) => {
      this.setState({cortex: updatedCortex});
    });
    this.state = {cortex: cortex};

    this.wsConnect = this.wsConnect.bind(this);
  }

  wsConnect() {
    var self = this;
    var sock = new WebSocketBridge();
    sock.connect(config.wsaddr);
    sock.listen(function(evt, stream) {
      if(self.state.cortex.status.val() === "loaded") {
        switch(evt.action) {
          case "remove":
            self.state.cortex.availableTasks[evt.task.code].destroy();
            break;
          case "add":
            var task = evt.task;
            convertTask(task);
            var obj = {};
            obj[task.code] = task;
            self.state.cortex.availableTasks.merge(obj);
            break;
        }
      }
    });
  }

  // TODO: load the user's available and selected tasks
  loadInitialData() {
    const self = this;
    var reqConfig = {
      headers: {
        'Authorization': 'Token ' + this.state.cortex.authToken.val()
      }
    };
    var availLoad = axios.get(config.httpaddr + '/available_tasks', reqConfig);
    var myTasksLoad = axios.get(config.httpaddr + '/selected_tasks', reqConfig);
    axios.all([availLoad, myTasksLoad])
      .then(axios.spread(function(avails, mine) {
        var myTasks = {};
        var availTasks = {};
        mine.data.forEach(function(task) {
          convertTask(task);
          myTasks[task.code] = task;
        });
        avails.data.forEach(function(task) {
          convertTask(task);
          availTasks[task.code] = task;
        });
        self.state.cortex.merge({
          status: "loaded", 
          availableTasks: availTasks,
          selectedTasks: myTasks
        });
      }))
      .catch(function(err) {
        // It's possible that we just need to log in...
        if(err.response) {
          if(err.response.status === 401 || err.response.status === 403) {
            self.state.cortex.merge({
              status: "unauthorized",
              authToken: null
            });
          } else {
            self.state.cortex.merge({
              status: "error",
              errText: err.response.statusText
            });
          }
        } else {
          self.state.cortex.merge({
            status: "error",
            errText: "server error"
          });
        }
      });
  }

  componentDidMount() {
    // This is really only for debugging now...
    if(this.state.cortex.status.val() === "loading" && 
       this.state.cortex.authToken.val() !== null) {
      this.wsConnect();
      this.loadInitialData();
    }
  }

  componentDidUpdate() {
    if(this.state.cortex.status.val() === "loading" && 
       this.state.cortex.authToken.val() !== null) {
      this.wsConnect();
      this.loadInitialData();
    }
  }

  render() {
    var screen;
    switch(this.state.cortex.status.getValue()) {
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
                    authToken={this.state.cortex.authToken}
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
