import React, { Component } from 'react';
import * as d3 from 'd3';
import config from './config';

const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function hoursFromMidnight(t) {
  var tt = t.clone().startOf('day');
  return t.diff(tt, 'hours', true); // real number diff
}

const margin = {
  top: 15,
  bottom: 5,
  left: 45,
  right: 5
};

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
    this.plot = svg.append('g')
      .attr('class', 'cal');

    this.dayScale = d3.scaleBand()
      .domain(days);
    this.timeScale = d3.scaleLinear()
      .domain([7, 21]); // hours
    this.catScale = d3.scaleOrdinal(config.colorScale)
      .domain([1, 8]);
    // create the basic structure
    this.timeAxis = svg.append('g')
      .attr('class', 'time axis');
    this.dateAxis = svg.append('g')
      .attr('class', 'date axis');

    this.dateAxis.selectAll('.day.label').data(days)
      .enter()
        .append('text')
          .attr('class', 'day label')
          //.attr('alignment-baseline', 'hanging')
          .attr('font-size', '12px')
          .text(function(d) {return d;});
  }

  updateCalendar() {
    const self = this;
    const svg = d3.select(this.svgNode);

    var plotWidth = this.props.size[0] - margin.left - margin.right,
        plotHeight = this.props.size[1] - margin.top - margin.bottom;
    
    // update scales
    this.dayScale.range([0, plotWidth]);
    this.timeScale.range([0, plotHeight]);

    // Axes and positioning updates
    var timeAxis = d3.axisLeft(this.timeScale);
    this.timeAxis
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(timeAxis);
    this.dateAxis.attr('transform', 'translate(' + margin.left + ', 0)');
    this.plot.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.selectAll('.day.label').data(days)
      .attr('x', function(d) {return self.dayScale(d);})
      .attr('y', 14);

    var taskBlocks = this.plot.selectAll('.task').data(self.props.tasks);
    var blockGroups = taskBlocks.enter()
      .append('g')
        .attr('class', 'task');
    blockGroups.append('rect');
    blockGroups.append('text')
      .attr('alignment-baseline', 'hanging');

    taskBlocks = this.plot.selectAll('.task').data(self.props.tasks);
    taskBlocks
      .attr('transform', function(d) {
        return 'translate(' + self.dayScale(d.date.format("ddd")) + ',' +
                              self.timeScale(hoursFromMidnight(d.starttime)) +
                              ')';
      })
      .on('click', function(d) {
        self.props.clickHandler(d);
      });
    taskBlocks.selectAll('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', function(d) {
        return self.dayScale.bandwidth();
      })
      .attr('height', function(d) {
        return self.timeScale(hoursFromMidnight(d.endtime)) - 
               self.timeScale(hoursFromMidnight(d.starttime));
      })
      .attr('fill', function(d) {
        return self.catScale(d.category);
      });
    taskBlocks.select('text')
      .text(function(d) {
        return d.desc;
      });
    taskBlocks.exit().remove();
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

