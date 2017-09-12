import React, { Component } from 'react';
import _ from 'lodash';

import Task from './Task';
import CalendarView from './CalendarView';

class SelectedTaskList extends Component {

  render() {
    const self = this;

    // TODO: order tasks somehow
    var sortedTasks = _.sortBy(this.props.tasks.val(), 'starttime');
    var tasks = sortedTasks.map(function(task, i) {
      return (
        <li key={i} onClick={self.props.clickHandler.bind(this, task)}>
          <Task task={task} />
        </li>
      );
    });
    return (
      <div className="SelectedTaskList">
        <CalendarView size={[500,500]} clickHandler={self.props.clickHandler} tasks={self.props.tasks.val()} />
        <ul>
          {tasks}
        </ul>
      </div>
    );
  }
}

export default SelectedTaskList;