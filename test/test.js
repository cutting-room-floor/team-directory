var test = require('tape');
var TeamDirectory = require('../');

function createDirectory() {
  var Directory = TeamDirectory(document.createElement('div'), {
    GitHubToken: 'process.env.GitHubToken',
    account: 'mapbox',
    repo: 'team-directory',
    team: 'team.json',
    form: 'data/form.json'
  });

  return Directory;
}

test('initialize', function(t) {
  var directory = createDirectory();
  t.ok(directory, 'directory was initialized');
  t.end();
});

// close the smokestack window once tests are complete
test('shutdown', function(t) {
  t.end();
  setTimeout(function() {
    window.close();
  });
});
