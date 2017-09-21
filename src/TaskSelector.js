import React, { Component } from 'react';
import axios from 'axios';
import config from './config';

import SelectedTaskList from './SelectedTaskList';
import AvailableTaskList from './AvailableTaskList';

var savingPanel = (
  <div className="SavingPanel">
    <label className="message">Saving...</label>
    <div className="loading-spinner"></div>
  </div>
);

class TaskSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
      requests: 0
    };
  }

  render() {
    var self = this;
    var handleTaskSelect = function(task, e) {
      var reqConfig = {
        headers: {
          'Authorization': 'Token ' + self.props.authToken.val()
        }
      };
      var req = axios.put(config.httpaddr + '/select_task/' + task.code, {}, reqConfig)
        .then(function(res) {
          var obj = {};
          obj[task.code] = task;
          self.props.selectedTasks.merge(obj);
          self.props.availableTasks[task.code].destroy();
          self.setState({message: null});
        })
        .catch(function(err) {
          var message = "Server error";
          if(err.response && err.response.data) {
            switch(err.response.data.code) {
              case "task_taken":
                message = task.desc + " already taken";
                break;
              default:
                message = err.response.data.code;
                break;
            }
          }
          self.setState({message: message});
        })
        .then(function() {
          self.setState({requests: self.state.requests-1});
        });
      // put this in the req state
      self.setState({requests: self.state.requests+1});
    };
    var handleTaskDeselect = function(task) {
      var reqConfig = {
        headers: {
          'Authorization': 'Token ' + self.props.authToken.val()
        }
      };
      var req = axios.delete(config.httpaddr + '/select_task/' + task.code, reqConfig)
        .then(function(res) {
          var obj = {};
          obj[task.code] = task;
          self.props.availableTasks.merge(obj);
          self.props.selectedTasks[task.code].destroy();
          self.setState({message: null});
        })
        .catch(function(err) {
          var message = "Server error";
          if(err.response && err.response.data) {
            switch(err.response.data.code) {
              case "task_not_removable":
                message = task.desc + " cannot be removed";
                break;
              default:
                message = err.response.data.code;
                break;
            }
          }
          self.setState({message: message});
        })
        .then(function() {
          self.setState({requests: self.state.requests-1});
        });
      // put this in the req state
      self.setState({requests: self.state.requests+1});
    };
    var msgPanel;
    if(this.state.message) {
      msgPanel = (
        <div className="alert alert-warning">
          <p><strong>Note:</strong>{this.state.message}</p>
        </div>
      );
    }
    return (
      <div className="TaskSelector">
        {msgPanel}
        {this.state.requests > 0 ? savingPanel : null}
        <div className="ui">
          <AvailableTaskList clickHandler={handleTaskSelect} 
                             tasks={this.props.availableTasks} 
                             selectedTasks={this.props.selectedTasks} />
          <SelectedTaskList clickHandler={handleTaskDeselect}
                            tasks={this.props.selectedTasks} />
        </div>
      </div>
    );
  }
}

export default TaskSelector;

