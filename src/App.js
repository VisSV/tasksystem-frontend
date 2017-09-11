import React, { Component } from 'react';
import Cortex from 'cortexjs';
import axios from 'axios';
import moment from 'moment';

import './App.css';
import config from './config';

import LoadingScreen from './LoadingScreen';
import TaskSelector from './TaskSelector';

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
    var self = this;
    var availLoad = axios.get('http://' + config.hostname + '/available_tasks');
    var myTasksLoad = axios.get('http://' + config.hostname + '/selected_tasks');
    axios.all([availLoad, myTasksLoad])
      .then(axios.spread(function(avails, mine) {
        mine.data.forEach(convertTask);
        avails.data.forEach(convertTask);
        self.state.cortex.set({
          status: "loaded", 
          availableTasks: avails.data, 
          selectedTasks: mine.data
        });
      }));
  }

  componentDidMount() {
    this.loadInitialData();
  }

  render() {
    var screen;
    switch(this.state.cortex.status.getValue()) {
      case "initializing":
        screen = <LoadingScreen />;
        break;
      case "loaded":
        screen = <TaskSelector 
                    availableTasks={this.state.cortex.availableTasks}
                    selectedTasks={this.state.cortex.selectedTasks} />
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
