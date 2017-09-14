import moment from 'moment';

var taskHours = function(task) {
  return moment.duration(task.endtime.diff(task.starttime)).asHours();
}

export default taskHours;

