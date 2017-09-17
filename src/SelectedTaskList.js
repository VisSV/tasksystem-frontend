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
      var clickHandler = null;
      var ttText = "";
      var className = "task";
      if(!task.is_sticky) {
        clickHandler = self.props.clickHandler.bind(this, task);
        ttText = "remove";
        className += " clickable";
      }
      return (
        <li key={i} onClick={clickHandler} className={className}>
          <Task task={task} tooltipText={ttText} />
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
