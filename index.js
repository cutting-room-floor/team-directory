import TeamDirectory from './src';

function Directory(id, options) {
  return new TeamDirectory(id, options);
}

if (window) {
  window.TeamDirectory = Directory;
} else if (typeof module !== 'undefined') {
  module.exports = Directory;
}
