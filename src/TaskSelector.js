import React, { Component } from 'react';
import axios from 'axios';
import config from './config';

import SelectedTaskList from './SelectedTaskList';
import AvailableTaskList from './AvailableTaskList';

class TaskSelector extends Component {
        //<CalendarView tasks={this.props.selctedTasks} />
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
        })
        .catch(function(err) {
          console.log(err);
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
        })
        .catch(function(err) {
          console.log(err);
        });
    };
    return (
      <div className="TaskSelector">
        <AvailableTaskList clickHandler={handleTaskSelect} 
                           tasks={this.props.availableTasks} 
                           selectedTasks={this.props.selectedTasks} />
        <SelectedTaskList clickHandler={handleTaskDeselect}
                          tasks={this.props.selectedTasks} />
      </div>
    );
  }
}

export default TaskSelector;

