var test = require('tape');
var TeamDirectory = require('../');

function createDirectory() {
  var options = {
    GitHubToken: process.env.GitHubToken,
    account: process.env.account,
    repo: process.env.repo,
    team: process.env.team,
    form: process.env.form
  }

  if (process.env.branch) options.branch = process.env.branch;
  var Directory = TeamDirectory(document.createElement('div'), options);
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
