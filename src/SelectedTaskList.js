import React, { Component } from 'react';
import axios from 'axios';
import config from './config';

import Task from './Task';
import CalendarView from './CalendarView';

class SelectedTaskList extends Component {
  unacceptTask(task) {
    axios.delete('http://' + config.hostname + '/select_task/' + task.code.val())
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  render() {
    var self = this;
    // TODO: order tasks somehow
    var tasks = this.props.tasks.map(function(task, i) {
      return (
        <li key={i} onClick={self.unacceptTask.bind(self, task)}>
          <Task task={task.val()} />
        </li>
      );
    });
    return (
      <div className="SelectedTaskList">
        <CalendarView size={[500,500]} tasks={self.props.tasks} />
        <ul>
          {tasks}
        </ul>
      </div>
    );
  }
}

export default SelectedTaskList;
