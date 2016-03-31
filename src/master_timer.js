var timeDiff = require('./time_diff');

module.exports = function MasterTimer(options) {
  this.timerCompleteCallback = options['onTimerComplete'];
  this.activeTimers = [];
  this.currentId = 1;

  // time in seconds
  this.addTimer = function(amountOfTime) {
    var newId = this.currentId++;
    var newTimer = { expires: (new Date(new Date().getTime() + amountOfTime * 1000)), id: newId };
    this.activeTimers.push(newTimer);
    return newTimer;
  };

  this.removeTimer = function(timerId) {
    var idx = this.activeTimers.findIndex(function(item) {
      return timerId === item['id'];
    });

    if (idx >= 0) {
      this.activeTimers = this.activeTimers.slice(0, idx).concat(this.activeTimers.slice(idx+1));
    } else {
      console.log(`could not find timer ${timerId}`);
    }
  }

  this.checkTimers = function() {
    var done = this.activeTimers.filter(function(timer) {
      return new Date() > timer['expires'];
    });

    var that = this;
    done.forEach(function(item) {
      console.log('done, removing', item);
      that.removeTimer(item['id']);
      that.timerCompleteCallback(item);
    });
  }

  this.start = function() {
    var that = this;
    this.windowTimerId = window.setInterval(function() {
      that.checkTimers();
    }, 100);
  }

}
