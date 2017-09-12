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
      axios.put('http://' + config.hostname + '/select_task/' + task.code)
        .then(function(res) {
          console.log(res);
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
      axios.delete('http://' + config.hostname + '/select_task/' + task.code)
        .then(function(res) {
          console.log(res);
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

