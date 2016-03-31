module.exports = function(earlier, later) {
  later = later ? later : new Date();

  return Math.round((later.getTime() - earlier.getTime()) / 1000);
}
