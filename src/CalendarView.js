import React, { Component } from 'react';
import * as d3 from 'd3';

const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function hoursFromMidnight(t) {
  var tt = t.clone().startOf('day');
  return t.diff(tt, 'hours', true); // real number diff
}

class CalendarView extends Component {
  constructor(props) {
    super(props);
    this.createCalendar = this.createCalendar.bind(this);
    this.updateCalendar = this.updateCalendar.bind(this);
  }

  componentDidMount() {
    this.createCalendar();
    this.updateCalendar();
  }

  componentDidUpdate() {
    this.updateCalendar();
  }

  createCalendar() {
    const svg = d3.select(this.svgNode);

    this.dayScale = d3.scaleBand()
      .domain(days);
    this.timeScale = d3.scaleLinear()
      .domain([0, 24]); // hours

    // create the basic structure
    this.timeAxis = svg.append('g')
      .attr('class', 'time axis');

    svg.selectAll('.day.label').data(days)
      .enter()
        .append('text')
          .attr('class', 'day label')
          .attr('alignment-baseline', 'hanging')
          .attr('font-size', '12px')
          .text(function(d) {return d;});
  }

  updateCalendar() {
    const self = this;
    const svg = d3.select(this.svgNode);

    // update scales
    this.dayScale.range([0, this.props.size[0]]);
    this.timeScale.range([this.props.size[1], 0]);

    this.timeAxis
      .attr('transform', 'translate(0, ' + this.props.size[1] + ')');
      //.attr(

    svg.selectAll('.day.label').data(days)
      .attr('x', function(d) {return self.dayScale(d);})
      .attr('y', 14);

    svg.selectAll('.task').data(self.props.tasks.val())
      .enter()
        .append('rect')
          .attr('class', 'task')
      //.merge()
        .attr('x', function(d) {
          return self.dayScale(d.date);
        })
        .attr('y', function(d) {
          return self.timeScale(hoursFromMidnight(d.starttime));
        })
        .attr('width', function(d) {
          return self.dayScale.bandwidth();
        })
        .attr('height', function(d) {
          return self.timeScale(hoursFromMidnight(d.starttime)) - 
                 self.timeScale(hoursFromMidnight(d.endtime));
        })
        .attr('fill', 'grey')
        //.text(function(d) {return d.desc;})
      .exit()
        .remove();
  }

  render() {
    // TODO: d3 calendar view of tasks
    return (
      <div className="CalendarView">
        <svg ref={node => this.svgNode = node} 
             width={this.props.size[0]} 
             height={this.props.size[1]}>
        </svg>
      </div>
    );
  }
}

export default CalendarView;

