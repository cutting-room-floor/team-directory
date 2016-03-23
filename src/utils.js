var utils = {};

utils.colN = function(n) {
  if (n === 2) return 6;
  if (n === 3) return 4;
  if (n === 4) return 3;
  if (n > 4 || n === 1) return 12;
};

module.exports = utils;
