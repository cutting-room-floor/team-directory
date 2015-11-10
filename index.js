import TeamDirectory from './src';

function exportFn(id, options) {
  return new TeamDirectory(id, options);
}

if (window) {
  window.TeamDirectory = exportFn;
} else if (typeof module !== 'undefined') {
  module.exports = exportFn;
}
