### v1.6.4

- [bug] Fix cases where the response returned from GitHub is not a Base64 encoded
string.

### v1.6.3

- [bug] UTF-8 encode non-ASCII names in vCards [#22](https://github.com/mapbox/team-directory/pull/22)

### v1.6.2

- [bug] Drop `toString` method on `defaultChecked` condition in radio elements
- [ui] Better label to describe downloading all contacts on listing page

### v1.6.1

- [bug] Better handling of `boolean` values
- [ui] Clear the select form type after selection
- [ui] Style autocomplete to better align with existing style

### v1.6.0

- [Feature] Add a autocomplete select from defined list form type [#17](https://github.com/mapbox/team-directory/issues/17)
- [Internal] Break form items into components [#13](https://github.com/mapbox/team-directory/issues/13)

### v1.5.0

- [UI] Add dismiss links to `add` form fields [#14](https://github.com/mapbox/team-directory/pull/14)
- [Feature] Add a `add-single` form field [#16](https://github.com/mapbox/team-directory/pull/16)

### v1.4.1

- [UI] Style admin fields differently [#11](https://github.com/mapbox/team-directory/issues/11)

### v1.4.0

- [feature] Add fuzzy filtering [#9](https://github.com/mapbox/team-directory/pull/9)
- [bug] Prolong loading until team data is fetched [#8](https://github.com/mapbox/team-directory/issues/8)

### v1.3.1

- [bug] User form values passed by parent to the form component were not updating as `componentWillReceiveProps` was not called.

### v1.3.0

- [feature] Added `pushState` as an optional flag to enable push state paths. Uses a hash prefix if this is not set.

### v1.2.3

- [bug] Missing basePath on conditioned filtering.

### v1.2.2

- [bug] Added `basePath` to all `reRoute` paths.

### v1.2.1

- [bug] Explicty pass `basePath` to all routes and use a base tag in index.html.

### v1.2.0

- [feature] Added optional `basePath` parameter to support root paths other than `'/'`.

### v1.1.0

- [feature] Added `user.edit` event
- [ui] Loading state on all IO
- [ui] Redirect to listing page after all user operations
- [bug] Pass optional branch param to fetch parameters.

### v1.0.5

- [bug] Fix error on `sorts` dispatching.

### v1.0.4

- [bug] Corrected documentation and function call for `sorts`.

### v1.0.3

- [bug] Corrected documentation and function calls for `listingTemplate` & `statsTemplate`.

### v1.0.2

- [bug] Support branches when reading form & team data contents.

### v1.0.1

- [bug] Deploy first release.

### v1.0.0

- Initial commit.
