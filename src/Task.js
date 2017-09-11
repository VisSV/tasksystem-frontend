import React, { Component } from 'react';

class Task extends Component {
  render() {
    return (
      <div className="task">
        <span className="code">{this.props.task.code}</span>
        <span className="desc">{this.props.task.desc}</span>
        <time className="day">{this.props.task.date.format('ddd')}</time>
        <time className="time">{this.props.task.starttime.format('hh:mm')}</time>
        <time className="time">{this.props.task.endtime.format('hh:mm')}</time>
      </div>
    );
  }
}

export default Task;

