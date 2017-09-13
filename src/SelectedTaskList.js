import React, { Component } from 'react';
import _ from 'lodash';

import Task from './Task';
import CalendarView from './CalendarView';
import LimitPanel from './LimitPanel';

class SelectedTaskList extends Component {

  render() {
    const self = this;

    var sortedTasks = _.sortBy(_.values(this.props.tasks.val()), 'starttime');
    var tasks = sortedTasks.map(function(task, i) {
      return (
        <li key={i} onClick={self.props.clickHandler.bind(this, task)}
            className="task">
          <Task task={task} tooltipText={"remove"} />
        </li>
      );
    });
    return (
      <div className="SelectedTaskList">
        <h1>Selected Tasks</h1>
        <LimitPanel tasks={self.props.tasks} />
        <CalendarView size={[600,500]} clickHandler={self.props.clickHandler} 
                                       tasks={_.values(self.props.tasks.val())} />
        <ul>
          {tasks}
        </ul>
      </div>
    );
  }
}

export default SelectedTaskList;
