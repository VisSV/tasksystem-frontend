import React, { Component } from 'react';
import config from './config';
import Color from 'color';

class Task extends Component {
  render() {
    var c = new Color(config.colorScale[this.props.task.category]);
    var style = {
      backgroundColor: c, 
      borderColor: c.darken(0.2)
    };
    return (
      <div className="Task" style={style}>
        <div className="task-info">
          <span className="code">{this.props.task.code}</span>
          <span className="desc">{this.props.task.desc}</span>
        </div>

        <div className="time-info">
          <time className="day">{this.props.task.date.format('ddd')}</time>
          <time className="time">{this.props.task.starttime.format('HH:mm')}</time>
          &ndash;
          <time className="time">{this.props.task.endtime.format('HH:mm')}</time>
        </div>
        
        <p className="tooltip">
          {this.props.tooltipText}
        </p>
      </div>
    );
  }
}

export default Task;

