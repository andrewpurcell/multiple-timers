var timeDiff = require('./time_diff');

module.exports = function TimerList(listElement, options) {
  if(options === undefined) {
    options = {};
  }

  this.options = Object.assign({
    countdownFormatter: countdownFormatter,
    renderItem: renderItem
  }, options);

  function countdownFormatter(timer) {
    return `Timer ${timer['id']} expiring in ${timeDiff(new Date(), timer['expires'])} seconds`;
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
}
