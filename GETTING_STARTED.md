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

### `TeamDirectory(el, options)`

- `el` (String or HTMLElement) of the container element the application should populate.
- `options` are as follows:

| Option | Value | Required | Default value | Description |
| --- | --- | --- | --- | --- |
| GitHubToken | String | &#x2713; | | A users GitHub token |
| account | String | &#x2713; | | GitHub organization or account name |
| repo | String | &#x2713; | | The repository where team & form documents are located |
| team | String | &#x2713; | | the path and filename in `repo` where team data is written out to |
| form | String | &#x2713; | | the path and filename in `repo` where form data is read from |
| filterKeys | Array | | `['github']` | An array of string keys that must correspond to a key property found in the form data. If an array is passed the two values are concatenated together (i.e. `['github', ['fname', 'lname']]`) |

### A basic form.json document

Team Directory is designed for you to provide your own form data to a user to
match your own needs. An example of a [form.json can be found here](https://github.com/mapbox/team-directory/blob/master/data/form.json) but at it's most basic the structure looks like this.

```json
{
  "Basic information": [{
    "key": "github",
    "label": "Github username",
    "required": true
  }, {
    "key": "birthday",
    "label": "Birthday",
    "type": "date"
  }]
}
```
A couple notes:

- __`Basic information`__ is the section name the form field belongs to. You can use any
arbitrary name here or break form fields into any number of sections.
- __GitHub__ is required. This is used in verification process to insure no
duplicate unique users are added.

As you can see in the above form.json example, each form field is represented
as an object with specific key/value pairings to describe it. The following keys
are as follows:


| Option | Value | Required | Description |
| --- | --- | --- | --- |
| key | String | &#x2713; | A unique key name |
| label | String | | Form label shown above the field element |
| required | Boolean | | If a form field is required the form won't submit for the user until a value has been passed. |
| type | string | | If this value isnt provided, it defaults to 'text' See below for form types and their structures |
| fields | string | &#x2713; for some type attributes | Specific to checkboxes and radios, fields are an array of objects with `key` and `label` properties |

### form types


## Advanced configuration

If you provide your own custom form data, you'll likely want to override
existing functionality to suit your needs.

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
