import React, { Component } from 'react';
import _ from 'lodash';
import taskHours from './util';

const groupLimits = {
  1: [0, 6],
  2: [0, 6],
  3: [0, 6],
  4: [0, 6],
  5: [1, 6],
  7: [1, 1]
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
    var groupHours = _.mapValues(groupedTasks, function(group) {
      return _.reduce(group, taskHours, 0);
    });
    var groups = _.sortBy(_.keys(groupLimits));
    var categoryCounts = groups.map(function(g) {
      var classes = "";
      if(groupHours[g] < groupLimits[g][0] || groupHours[g] > groupLimits[g][1]) {
        classes = classes + " violation";
      }
      return (
        <li className={classes} key={g}>
          <label>Category {g}</label>
          <div className="count">
            {groupLimits[g][0]} &le; {groupHours[g]} &le; {groupLimits[g][1]}
          </div>
        </li>
      );
    });
    var ttlHours = _.reduce(tasks, function(ttl, task) {
      return ttl + taskHours(task);
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

