import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';

const groupLimits = {
  1: 3
}
const hourLimit = 20;

var defaultGroups = {};
_.keys(groupLimits).forEach(function(k) {
  defaultGroups[k] = [];
});

// Limits are not explicitly enforced. The old system did this so 
// this one does the same
class LimitPanel extends Component {
  render() {
    var tasks = _.values(this.props.tasks.val());
    var groupedTasks = _.groupBy(_.values(tasks), 'category');
    groupedTasks = Object.assign({}, defaultGroups, groupedTasks);
    var groups = _.sortBy(_.keys(groupLimits));
    var categoryCounts = groups.map(function(g) {
      var classes = "";
      if(groupedTasks[g].length > groupLimits[g]) {
        classes = classes + " violation";
      }
      return (
        <li className={groupedTasks[g].length > groupLimits[g] ? 'violation' : ''} key={g}>
          <label>Category {g}</label>
          <div className="count">
            {groupedTasks[g].length} / {groupLimits[g]}
          </div>
        </li>
      );
    });
    var ttlHours = _.reduce(tasks, function(ttl, task) {
      var hours = moment.duration(task.endtime.diff(task.starttime)).asHours();
      return ttl + hours;
    }, 0);
    
    return (
      <div className="LimitPanel">
        <h2>Limits</h2>
        <ul>
          {categoryCounts}
          <li className={ttlHours < hourLimit ? 'violation' : ''}>
            <label>Total hours</label>
            <div className="count">
              {ttlHours} / {hourLimit}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default LimitPanel;

