Team directory
---

A read/write interface for team data with data managed on GitHub. Features include:

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

## Getting started

Read [GETTING_STARTED.md](https://github.com/mapbox/team-directory/blob/master/GETTING_STARTED.md)
to learn more.

## Contributing

Clone a copy of this project, change into the project directory from the terminal
and install dependencies with `npm install`. When installation is complete run
`npm start` to start a server on `http://localhost:9966/` you'll want to verify
you have the right credentials entered as options when instantiating TeamDirectory.
See the [index file for an example](https://github.com/mapbox/team-directory/blob/master/index.html).
