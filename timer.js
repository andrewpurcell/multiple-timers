var timeDiff = function(earlier, later) {
  later = later ? later : new Date();

  return Math.round((later.getTime() - earlier.getTime()) / 1000);
}

function MasterTimer(options) {
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
      console.log('could not find timer', timerId);
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

function TimerList(listElement, options) {
  if(options === undefined) {
    options = {};
  }

  this.options = Object.assign(options, {
    countdownFormatter: countdownFormatter,
    renderItem: renderItem
  });

  function countdownFormatter(timer) {
    return 'Timer ' + timer['id'] + ' expiring in ' + timeDiff(new Date(), timer['expires']) + ' seconds';
  };

  function renderItem(item) {
    var node = document.createElement('li');
    var text = document.createTextNode(this.options.countdownFormatter(item));
    node.appendChild(text);
    return node;
  }

  this.listElement = listElement;

  this.items = [];

  this.addItem = function(obj) {
    this.items.push(obj);
    this.redraw();
  };

  this.removeItem = function(obj) {
    var idx = this.items.indexOf(obj);
    this.items = this.items.slice(0, idx).concat(this.items.slice(idx+1));
    this.redraw();
  };

  this.redraw = function() {
    while (this.listElement.firstChild) {
      this.listElement.removeChild(this.listElement.firstChild);
    }

    this.items.forEach(function(item) {
      var node = this.options.renderItem.apply(this, [item]);
      this.listElement.appendChild(node);
    }, this);

  };
};

function TickingClock(element, startTime) {
  this.timeReference = startTime ? startTime : new Date();
  this.element = element;

  this.start = function() {
    var that = this;

    window.setInterval(function() {
      that.element.textContent = timeDiff(that.timeReference) + ' seconds';
    }, 100);
  }
}

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
      return 'Timer ' + timer['id'] + ' expired ' + timeDiff(timer['expires'])+ ' seconds ago';
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
