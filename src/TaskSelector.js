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
          self.props.selectedTasks.push(task);
          task = self.props.availableTasks.find(function(t) {
            return t.code.val() === task.code;
          });
          task.destroy();
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
          self.props.availableTasks.push(task);
          task = self.props.selectedTasks.find(function(t) {
            return t.code.val() === task.code;
          });
          task.destroy();
        })
        .catch(function(err) {
          console.log(err);
        });
    };
    return (
      <div className="TaskSelector">
        <AvailableTaskList clickHandler={handleTaskSelect} 
                           tasks={this.props.availableTasks} />
        <SelectedTaskList clickHandler={handleTaskDeselect}
                          tasks={this.props.selectedTasks} />
      </div>
    );
  }
}

export default TaskSelector;

