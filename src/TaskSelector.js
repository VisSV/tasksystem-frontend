import React, { Component } from 'react';

import SelectedTaskList from './SelectedTaskList';
import AvailableTaskList from './AvailableTaskList';

class TaskSelector extends Component {
        //<CalendarView tasks={this.props.selctedTasks} />
  render() {
    return (
      <div className="TaskSelector">
        <AvailableTaskList tasks={this.props.availableTasks} />
        <SelectedTaskList tasks={this.props.selectedTasks} />
      </div>
    );
  }
}

export default TaskSelector;

