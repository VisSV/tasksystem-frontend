import React, { Component } from 'react';

class Task extends Component {
  render() {
    return (
      <div className="task">
        <span className="code">{this.props.task.code}</span>
        <span className="desc">{this.props.task.desc}</span>
        <time className="day">Mon{this.props.task.date}</time>
        <time className="time">{this.props.task.starttime}</time>
        <time className="time">{this.props.task.endtime}</time>
      </div>
    );
  }
}

export default Task;

