Team directory
---

[![Circle CI](https://circleci.com/gh/mapbox/team-directory.svg?style=svg)](https://circleci.com/gh/mapbox/team-directory)

A read/write interface for team data with data managed on GitHub. 

![demo](https://i.imgur.com/LdW1GCz.gif)

Features include:

- List filtering/sorting with stored params
- [vCard](https://en.wikipedia.org/wiki/VCard) downloads (single or entire team)
- Stats display based on team data
- User/admin only editing access

##### Customization

- Your own data. Provide a json document of form field objects and team
directory renders each one into submittable fields for each user.
- Listing display. Limit fields that are displayed on the main listing by opting
for which ones are used in a template.
- Stats display
- Sorting
- List filtering
- Form validation
- Value normalization

##### Light admin access

If an admin key is set to true on a user they are granted additional features:

- View/edit all users
- Download all fields from the team list as a CSV document.

---

## [Getting started][]
## [Contributing][]

[Contributing]: https://github.com/mapbox/team-directory/blob/master/CONTRIBUTING.md
[Getting started]: https://github.com/mapbox/team-directory/blob/master/GETTING_STARTED.md
[index]: https://github.com/mapbox/team-directory/blob/master/index.html
