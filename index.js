import TeamDirectory from './src';

function Directory(id, options) {
  return new TeamDirectory(id, options);
}

if (window && typeof module !== 'undefined' && module.exports) {
  window.TeamDirectory = module.exports = Directory;
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = Directory;
} else {
  window.TeamDirectory = Directory;
}
