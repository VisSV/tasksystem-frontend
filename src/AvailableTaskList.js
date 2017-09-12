import React, { Component } from 'react';
import _ from 'lodash';

import Task from './Task'

class AvailableTaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showConflicts: true,
      groupBy: "category"
    };
  }

  showAllTasks(e) {
    this.setState({showConflicts: true});
  }

  showUnconflictingTasks(e) {
    this.setState({showConflicts: false});
  }

  updateGroup(e) {
    this.setState({groupBy: e.target.value});
  }

  render() {
    var self = this;
    // TODO: filter tasks by this.state.showConflicts
    var availTasks = this.props.tasks.val();
    if(!this.state.showConflicts) {
      const selTasks = _.values(self.props.selectedTasks.val());
      _.keys(availTasks).forEach(function(k) {
        var task = availTasks[k];
        var overlapIdx = _.findIndex(selTasks, function(st) {
          var maxStart = Math.max(task.starttime, st.starttime);
          var minEnd = Math.min(task.endtime, st.endtime);
          return maxStart < minEnd;
        });
        if(overlapIdx >= 0) {
          _.unset(availTasks, k);
        }
      });
    }
    var groupedTasks = _.groupBy(availTasks, self.state.groupBy);
    var groups = _.sortBy(_.keys(groupedTasks));
    var availTasks = groups.map(function(gid, i) {
      var taskGroup = _.sortBy(groupedTasks[gid], 'code');
      var groupName = self.state.groupBy + ' ' + gid;
      var tasks = taskGroup.map(function(task, j) {
        return(
          <li className="task" key={j} onClick={self.props.clickHandler.bind(this, task)}>
            <Task task={task} />
          </li>
        );
        // TODO: need a spinner here for the selecting task query
      });
      return (
        <li className="taskgroup" key={i}>
          <h3 className="category">{groupName}</h3>
          <ul>
            {tasks}
          </ul>
        </li>
      );
    });
    return (
      <div className="AvailableTaskList">
        <h1>Available Tasks</h1>
        <div className="taskfilter">
          <h2>Filter by</h2>
          <input type="radio" name="taskfilter" id="taskfilter-all" 
                 checked={self.state.showConflicts}
                 onChange={self.showAllTasks.bind(this)} value="all" />
          <label htmlFor="taskfilter-all">All</label>
          <input type="radio" name="taskfilter" id="taskfilter-noconflict" 
                 checked={!self.state.showConflicts}
                 onChange={self.showUnconflictingTasks.bind(this)} value="noconflict" />
          <label htmlFor="taskfilter-noconflict">Non-overlapping</label>
        </div>
        <div className="taskgrouper">
          <h2>Group by</h2>
          <input type="radio" name="taskgroup" id="taskgroup-category"
                 checked={self.state.groupBy === "category"}
                 onChange={self.updateGroup.bind(this)} 
                 value="category" />
          <label htmlFor="taskgroup-category">Category</label>
          <input type="radio" name="taskgroup" id="taskgroup-date"
                 checked={self.state.groupBy === "date"}
                 onChange={self.updateGroup.bind(this)} 
                 value="date" />
          <label htmlFor="taskgroup-date">Date</label>
        </div>
        <ul className="availabletasks">
          {availTasks}
        </ul>
      </div>
    );
  }
}

export default AvailableTaskList;
