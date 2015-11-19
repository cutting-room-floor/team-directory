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
  t.plan(2);

  directory.on('load', function(e) {
    t.ok(e, 'data loaded');
  });

  t.ok(directory, 'directory was initialized');
});

// close the smokestack window once tests are complete
test('shutdown', function(t) {
  t.end();
  setTimeout(function() {
    window.close();
  });
});
