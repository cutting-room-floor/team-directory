## Getting started

### Quick start

```html
<div id='app'></div>
<script src='../dist/team-directory.js'></script>

<script>
TeamDirectory(document.getElementById('app'), {
  GitHubToken: 'TOKENHERE', // A users GitHub token
  account: 'mapbox', // GitHub org or account name
  repo: 'team-directory', // The repository team and form data is found in
  team: 'team.json', // Team data filname
  form: 'data/form.json' // Form data filename
});
</script>
```

FIll out the values above with your own credentials. An example configuration
can be found [here](https://github.com/mapbox/team-directory/blob/master/index.html).

## Configuration methods

#### `TeamDirectory.sorts`

Provide your own custom sorting on the listings page. `sorts` should equal an
array of objects with `key` & `sort` pairings. `Key` must must correspond to a
key attribute in the form data and the `sort` function should return the sorted
array when complete.

```js
var directions = (document.getElementById('app'), options);

directions.sorts = [{
    key: 'date',
    sort: function(team) {
      return team.sort((a, b) => {
        return new Date(b.birthday).getTime() - new Date(a.birthday).getTime();
      });
    }
  }, {
    key: 'name',
    return team.sort((a, b) => {
      return a.localeCompare(b);
    });
  }
}];
```
