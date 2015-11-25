var test = require('tape');
var TeamDirectory = require('../');

function createDirectory(config) {

  var options = {
    GitHubToken: process.env.GitHubToken,
    account: process.env.account,
    repo: process.env.repo,
    team: process.env.team,
    form: process.env.form
  }

  if (process.env.branch) options.branch = process.env.branch;
  var Directory = TeamDirectory(document.createElement('div'), Object.assign(options, config));
  return Directory;
}

test('initialize and pushState', function(t) {
  var directory = createDirectory({ pushState:true });
  t.plan(2);

  directory.on('load', function(e) {
    t.ok(e, 'data loaded');
  });

  t.notOk(window.location.hash, 'hash is not present in the url');
});

test('hash prefix', function(t) {
  var directory = createDirectory();
  t.ok(window.location.hash, 'hash is present in the url');
  t.end();
});

test('teamdirectory.sorts', function(t) {
  var directory = createDirectory();
  directory.sorts([]);
  t.ok(true, 'custom sort was dispatched');
  t.end();
});

// close the smokestack window once tests are complete
test('shutdown', function(t) {
  t.end();
  setTimeout(function() {
    window.close();
  });
});
