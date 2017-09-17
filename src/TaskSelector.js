import React, { Component } from 'react';
import axios from 'axios';
import config from './config';

import SelectedTaskList from './SelectedTaskList';
import AvailableTaskList from './AvailableTaskList';

class TaskSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {message: null};
  }

  render() {
    var self = this;
    var handleTaskSelect = function(task, e) {
      var reqConfig = {
        headers: {
          'Authorization': 'Token ' + self.props.authToken.val()
        }
      };
      axios.put(config.httpaddr + '/select_task/' + task.code, {}, reqConfig)
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
        });
    };
    var handleTaskDeselect = function(task) {
      var reqConfig = {
        headers: {
          'Authorization': 'Token ' + self.props.authToken.val()
        }
      };
      axios.delete(config.httpaddr + '/select_task/' + task.code, reqConfig)
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
        });
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

