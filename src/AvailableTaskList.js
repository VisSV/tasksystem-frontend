import React, { Component } from 'react';
import _ from 'lodash';

import Task from './Task'

const dayOrder = {
  "Sat": 1,
  "Sun": 2,
  "Mon": 3,
  "Tue": 4,
  "Wed": 5,
  "Thu": 6,
  "Fri": 7
};

class AvailableTaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showConflicts: false,
      groupBy: "category"
    };

    this.groupTasks = this.groupTasks.bind(this);
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

  groupTasks(tasks) {
    var self = this;
    // Group by whatever the thing is set to
    var groupedTasks;
    var ts = _.values(tasks);
    switch(self.state.groupBy) {
      case "date":
        groupedTasks = _.groupBy(ts, function(tt) {
          //return tt.date.format("YYYY-MM-DD");
          return tt.date.format("ddd");
        });
        break;
      case "category":
        groupedTasks = _.groupBy(ts, function(tt) {
          return "Category " + tt.category;
        });
        break;
      default:
        groupedTasks = _.groupBy(ts, self.state.groupBy);
        break;
    }
    return groupedTasks;
  }

  render() {
    var self = this;
    // Filter by the available tasks
    var tasks = Object.assign({}, this.props.tasks.val());
    if(!this.state.showConflicts) {
      const selTasks = _.values(self.props.selectedTasks.val());
      _.keys(tasks).forEach(function(k) {
        var task = tasks[k];
        var overlapIdx = _.findIndex(selTasks, function(st) {
          var maxStart = Math.max(task.starttime, st.starttime);
          var minEnd = Math.min(task.endtime, st.endtime);
          return maxStart < minEnd;
        });
        if(overlapIdx >= 0) {
          _.unset(tasks, k);
        }
      });
    }
    var groupedTasks = this.groupTasks(tasks);
    var groups = _.keys(groupedTasks);
    if(self.state.groupBy === "date") {
      groups = _.sortBy(groups, function(d) {
        return dayOrder[d];
      });
    } else {
      groups = _.sortBy(groups);
    }
    var availTasks = groups.map(function(gid, i) {
      var taskGroup = _.sortBy(groupedTasks[gid], 'code');
      var groupName = gid;
      var tasks = taskGroup.map(function(task, j) {
        var clickHandler = null;
        var ttText = "";
        var className = "task";
        if(!task.is_sticky) {
          clickHandler = self.props.clickHandler.bind(this, task);
          ttText = "add";
          className += " clickable";
        }
        return(
          <li key={j} onClick={clickHandler} className={className}>
            <Task task={task} tooltipText={ttText} />
          </li>
        );
        // TODO: need a spinner here for the selecting task query
      });
      return (
        <li className="taskgroup" key={i}>
          <h2 className="category">{groupName}</h2>
          <ul>
            {tasks}
          </ul>
        </li>
      );
    });
    return (
      <div className="AvailableTaskList">
        <h1>Available Tasks</h1>
        <div className="view-controls">
          <div className="taskfilter">
            <h3>Filter by</h3>
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
            <h3>Group by</h3>
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
        </div>
        <ul className="availabletasks">
          {availTasks}
        </ul>
      </div>
    );
  }
}

export default AvailableTaskList;
