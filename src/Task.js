import React, { Component } from 'react';
import config from './config';

class Task extends Component {
  render() {
    return (
      <div className="Task" style={{backgroundColor: config.colorScale[this.props.task.category]}}>
        <div className="task-info">
          <span className="code">{this.props.task.code}</span>
          <span className="desc">{this.props.task.desc}</span>
        </div>

        <div className="time-info">
          <time className="day">{this.props.task.date.format('ddd')}</time>
          <time className="time">{this.props.task.starttime.format('hh:mm')}</time>
          &ndash;
          <time className="time">{this.props.task.endtime.format('hh:mm')}</time>
        </div>
        
        <p className="tooltip">
          {this.props.tooltipText}
        </p>
      </div>
    );
  }
}

export default Task;

