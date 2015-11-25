### v1.3.1

- [bug] user form values passed by parent to the form component were not updating as `componentWillReceiveProps` was not called.

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
