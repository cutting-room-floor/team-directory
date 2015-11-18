import TeamDirectory from './src';

function Directory(id, options) {
  return new TeamDirectory(id, options);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Directory;
} else {
  window.TeamDirectory = Directory;
}
