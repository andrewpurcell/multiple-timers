var timeDiff = require('./time_diff');
var MasterTimer = require('./master_timer');
var TimerList = require('./timer_list');
var TickingClock = require('./ticking_clock');

document.addEventListener('DOMContentLoaded', function() {
  (function(timeOptionListSelector, optionsInMinutes) {
    var timeSelectorElement = document.querySelector(timeOptionListSelector);

    optionsInMinutes.forEach(function(minutes) {
      var option = document.createElement('option');
      option.setAttribute('value', minutes * 60);
      option.textContent = minutes;
      timeSelectorElement.appendChild(option);
    });
  })('#new_timer', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  var activeTimerList = new TimerList(document.querySelector('ul.active-timers'));

  var finishedTimerList = new TimerList(document.querySelector('ul.completed-timers'), {
    countdownFormatter: function(timer) {
      return `Timer ${timer['id']} expired ${timeDiff(timer['expires'])} seconds ago`;
    }
  });

  var masterTimer = new MasterTimer({
    onTimerComplete: function(timer) {
      var alarm = new Audio('alarm.mp3');
      alarm.play();
      activeTimerList.removeItem(timer);

      finishedTimer = Object.assign({}, timer, { expires: new Date() });
      finishedTimerList.addItem(finishedTimer);
    }
  });

  window.setInterval(function() {
    activeTimerList.redraw();
    finishedTimerList.redraw();
  }, 100);

  var tickingClock = new TickingClock(document.querySelector('.current-time .clock'));
  tickingClock.start();

  var startTime = new Date();
  masterTimer.start();

  document.querySelector('#add-timer').addEventListener('submit', function(event) {
    event.preventDefault();

    var time = event.target.querySelector('select').value;
    var newTimer = masterTimer.addTimer(time);

    activeTimerList.addItem(newTimer);
  });
});
