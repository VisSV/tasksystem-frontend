import React, { Component } from 'react';
import axios from 'axios';
import config from './config';

import SelectedTaskList from './SelectedTaskList';
import AvailableTaskList from './AvailableTaskList';
import _ from 'lodash';

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
      
      //check if the task to be selected overlaps with any existing selected task
      const selTasks = _.values(self.props.selectedTasks.val());
      var overlapTaskId = 0;
      var overlapTaskDess = "";
      var overlappingTasks = [];
      var overlapIdx = _.findIndex(selTasks, function(st) {
        overlapTaskId = st.code;
        overlapTaskDess = st.desc;
        var maxStart = Math.max(task.starttime, st.starttime);
        var minEnd = Math.min(task.endtime, st.endtime);
        if(maxStart < minEnd)
          overlappingTasks.push(st);
        return maxStart < minEnd;
      });
      if(overlappingTasks.length > 0) {
        var message = " Overlap with tasks: " ;
        overlappingTasks.forEach(function(overlapTask) {
          message += ` ${overlapTask.code} - ${overlapTask.desc}`;
        });
        message += ". Remove these tasks before selecting this task.";
        self.setState({ message: message });
        return;
      }
      
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
          if (self.props.availableTasks[task.code]) {
            self.props.availableTasks[task.code].destroy();
          }
          self.setState({message: null});
        })
        .catch(function(err) {
          var message = "Server error";
          console.log("err: "+err.response);
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

