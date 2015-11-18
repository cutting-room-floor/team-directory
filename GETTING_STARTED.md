## Getting started

```html
<div id='app'></div>
<script src='../dist/team-directory.js'></script>

<script>
TeamDirectory(document.getElementById('app'), {
  GitHubToken: 'A USERS GITHUB TOKEN',
  account: 'NAME OF GITHUB ACCOUNT',
  repo: 'NAME OF REPO DATA IS STORED',
  team: 'TEAM DATA FILE NAME',
  form: 'FORM DATA FILE NAME'
});
</script>
```

FIll out the values above with your own credentials. An example configuration
can be found [here](https://github.com/mapbox/team-directory/blob/master/index.html).

## Configuration
