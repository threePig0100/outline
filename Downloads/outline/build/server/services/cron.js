"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;
var _time = require("./../../shared/utils/time");
var _tasks = _interopRequireDefault(require("./../queues/tasks"));
var _BaseTask = require("./../queues/tasks/BaseTask");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function init() {
  async function run(schedule) {
    for (const name in _tasks.default) {
      const TaskClass = _tasks.default[name];
      if (TaskClass.cron === schedule) {
        await TaskClass.schedule({
          limit: 10000
        });
      }
    }
  }
  setInterval(() => void run(_BaseTask.TaskSchedule.Daily), _time.Day);
  setInterval(() => void run(_BaseTask.TaskSchedule.Hourly), _time.Hour);

  // Just give everything time to startup before running the first time. Not
  // _technically_ required to function.
  setTimeout(() => {
    void run(_BaseTask.TaskSchedule.Daily);
    void run(_BaseTask.TaskSchedule.Hourly);
  }, 30 * _time.Second);
}