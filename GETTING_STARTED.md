## Getting started

#### Table of contents

- [Quick start](#quick-start)
- [Initializing](#initializing)
  - [form.json](#formjson)
  - [form.json types](#formjson-types)
- [Advanced configuration](#advanced-configuration)
  - [Sorts](#teamdirectorysorts)
  - [Validators](#teamdirectoryvalidators)
  - [Normalizers](#teamdirectorynormalizers)
  - [Listing Template](#teamdirectorylistingtemplate)
  - [Stats Template](#teamdirectorystatstemplate)
- [Events](#events)

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

### Initializing

___`TeamDirectory(el, options)`___
- `el` (String or HTMLElement) of the container element the application should populate.
- `options` are as follows:

| Option | Value | Required | Default value | Description |
| --- | --- | --- | --- | --- |
| GitHubToken | String | &#x2713; | | A users GitHub token |
| account | String | &#x2713; | | GitHub organization or account name |
| repo | String | &#x2713; | | The repository where team & form documents are located |
| team | String | &#x2713; | | the path and filename in `repo` where team data is written out to |
| form | String | &#x2713; | | the path and filename in `repo` where form data is read from |
| branch | String | | | Specify a specific branch found in `repo` |
| pushState | Boolean | | `false`| Set to `true` to enable `history.pushstate` Defaults to hash prefixed paths. |
| basePath | String | | `'/'`| Pass an alternate path team-directory should be built from |
| filterKeys | Array | | `['github', 'fname']` | An array of keys as strings that correspond to a key property names found in your form data. |

#### form.json

Team Directory is designed for you to provide your own form data to meet your
own needs. An example of a [form.json can be found here](https://github.com/mapbox/team-directory/blob/master/data/form.json) but at it's most basic the structure looks
like this:

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

_A couple notes:_

- __`Basic information`__ is the section name the form field belongs to. You can use any
arbitrary name here or break form fields into any number of sections.
- __GitHub__ is required. This is used in the verification process to insure no
duplicate users is created.

As you can see from the example json above, each form field is represented
as an object with specific key/value pairings. There are a few as follows:


| Option | Value | Required | Description |
| --- | --- | --- | --- |
| key | String | &#x2713; | A unique key name |
| label | String | | Form label shown above the field element |
| required | Boolean | | If a form field is required the form won't submit for the user until a value has been passed. |
| admin | Boolean | | Form field is only present if the user editing has `admin: true` set in their user object. |
| fields | string | &#x2713; for some type attributes | Specific to checkboxes and radios, fields are an array of objects with `key` and `label` properties |
| type | string | | If this value isnt provided, it defaults to 'text' See below for form types and their structures |

#### form.json types

##### `add`

```json
{
  "key": "other-links",
  "label": "Other links",
  "type": "add"
}
```

A form field for adding multiple name/value pairings. Stored as an array of objects
with `name` and `value` properties.

##### `add-single`

```json
{
  "key": "tags",
  "label": "Add tags",
  "type": "add-single"
}
```

A form field for adding multiple values. Stored as an array of strings.

##### `select`

```json
{
  "key": "languages",
  "label": "Languages spoken",
  "type": "select",
  "options": [{
    "label": "English",
    "key": "en"
  }, {
    "label": "Español",
    "key": "es"
  }, {
    "label": "German",
    "key": "de"
  }, {
    "label": "French",
    "key": "fr"
  }]
}
```

A autocomplete form field for adding multiple values from a defined list.

##### `textarea`

```json
{
  "key": "adress",
  "label": "Home address",
  "type": "textarea"
{
```

`textarea` input type.

##### `checkbox`

```json
{
  "key": "teams",
  "label": "Teams (check all that apply)",
  "required": true,
  "type": "checkbox",
  "fields": [{
    "key": "business",
    "label": "Business"
  }, {
    "key": "design",
    "label": "Design"
  }, {
    "key": "engineering",
    "label": "Engineering"
  }, {
    "key": "operations",
    "label": "Operations"
  }, {
    "key": "support",
    "label": "Support"
  }]
}
```

Checkbox input type.

##### `radio`

```json
{
  "key": "office",
  "label": "Office",
  "type": "radio",
  "fields": [{
    "key": "dc",
    "label": "DC"
  }, {
    "key": "sf",
    "label": "SF"
  }, {
    "key": "ayacucho",
    "label": "Peru"
  }, {
    "key": "bengaluru",
    "label": "India"
  }]
}
```

Radio input type

##### `number`

```json
{
  "key": "call",
  "label": "Mobile number",
  "type": "number"
}
```

Number input type.

##### `date`

```json
}
  "key": "birthday",
  "label": "Birthday",
  "type": "date"
}
```

Date input type.

### Advanced configuration

If you provide your own custom form data, you'll likely want to override
existing functionality to suit your needs.

#### `TeamDirectory.sorts`

Provide your own custom sorting on the listings page. `sorts` should equal an
array of objects with `key` & `sort` pairings. `Key` must must correspond to a
key attribute in the form data and the `sort` function should return the sorted
array when complete.

```js
var directory = TeamDirectory(document.getElementById('app'), options);

directory.sorts([
  {
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
]);
```

#### `TeamDirectory.validators`

Custom validation that's called before a team member is created or updated.
The validators function is passed two arguments: `obj` The team member object &
`callback` A function that's called in your code with either a string messsage
describing a validation error found or `null` (no error found). Team member
data will not be submitted until validation passes.

```js
var directory = TeamDirectory(document.getElementById('app'), options);

directory.validators(function(obj, callback) {
 if (obj.office === 'other' && !obj.city) {
   return callback('If the office selected is other, please enter your city');
 }

 // No validation errors if it gets here
 return callback(null);
});
```

#### `TeamDirectory.normalizers`

Format/normalize fields a user before its submitted. The normalizer function is
passed two arguments: `obj` The team member object & `callback` A function
that's called at the end of the function containing the new normalized/formatted
user object. Team member data will not be submitted until this callback is called.

```js
var directory = TeamDirectory(document.getElementById('app'), options);

directory.normalizers(function(obj, callback) {
 return callback(obj.map(function(data) {

   // Remove any capitalization from an entered username.
   data.username = data.username.toLowerCase();
   return data;
 });
});
```

#### `TeamDirectory.listingTemplate`

Create a custom listing template for team members. The listingTemplate is a
function passed one argument: `obj` the current user in a list drawn out to
the main page. The function must return [jsx template](https://facebook.github.io/jsx/).

```js
var directory = TeamDirectory(document.getElementById('app'), options);

directory.listingTemplate(function(obj) {
 var fullName = obj.fname + ' ' + obj.lname;

 return (
   <div>
     <strong>{fullName}</strong>
     <em>{obj.birthday}</em>
   </div>
 );
});
```

#### `TeamDirectory.statsTemplate`

Evaluate team user data and present a template of found statistics. The
statsTemplate is passed one argument: `team` the team array of users. The
function must return [jsx template](https://facebook.github.io/jsx/). If no
statsTemplate is provided, the teamStats link and modal will not be present
on the listing page.

```js
var directory = TeamDirectory(document.getElementById('app'), options);

directory.statsTemplate(function(team) {
 var length = team.length;
 var phones = team.filter(function(member) {
   return member.phone;
 }).length;

 return (
   <div>
     <h2>Team stats</h2>
     <p>There are {length} total team members and {phones} have phones.</p>
   </div>
 );
});
```

### Events

___`TeamDirectory.on(type, function)`___

Clients can subscribe to events that happen in the application.

```js
var directory = TeamDirectory(document.getElementById('app'), options);

// Get team data when it's available on the page
directory.on('load', function(ev) {
    console.log(ev.team);
});
```

Available types are as follows:

- `load`
- `user.created`
- `user.editing`
- `user.updated`
- `user.removed`
