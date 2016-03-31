var timeDiff = require('./time_diff');

module.exports = function TickingClock(element, startTime) {
  this.timeReference = startTime ? startTime : new Date();
  this.element = element;

  this.start = function() {
    var that = this;

    window.setInterval(function() {
      that.element.textContent = `${timeDiff(that.timeReference)} seconds`;
    }, 100);
  }
}
