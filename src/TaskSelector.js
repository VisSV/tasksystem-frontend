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
    var handleTaskSelect = function(task) {
      var reqConfig = {
        headers: {
          'Authorization': 'Token ' + self.props.authToken.val()
        }
      };
      axios.put('http://' + config.hostname + '/select_task/' + task.code, {}, reqConfig)
        .then(function(res) {
          var obj = {};
          obj[task.code] = task;
          self.props.selectedTasks.merge(obj);
          self.props.availableTasks[task.code].destroy();
          self.setState({message: null});
        })
        .catch(function(err) {
          if(err.response && err.response.data) {
            if(err.response.data.code == "task_taken") {
              self.setState({
                message: task.desc + " already taken"
              });
              self.props.availableTasks[task.code].destroy();
            }
          } else {
            self.setState({message: "Server error"});
          }
        });
    };
    var handleTaskDeselect = function(task) {
      var reqConfig = {
        headers: {
          'Authorization': 'Token ' + self.props.authToken.val()
        }
      };
      axios.delete('http://' + config.hostname + '/select_task/' + task.code, reqConfig)
        .then(function(res) {
          var obj = {};
          obj[task.code] = task;
          self.props.availableTasks.merge(obj);
          self.props.selectedTasks[task.code].destroy();
          self.setState({message: null});
        })
        .catch(function(err) {
          self.setState({message: "Server error"});
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

