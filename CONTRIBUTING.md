## Developing

- Clone a copy of this project
- Change into the project directory from the terminal and install dependencies via `npm install`.
- Add your credentials as options when instantiating `TeamDirectory`. See this projects [index][] as example and read [Getting started][] to learn more.
- Run `npm start` to start a server on `http://localhost:9966/`.

[Getting started]: https://github.com/mapbox/team-directory/blob/master/GETTING_STARTED.md
[index]: https://github.com/mapbox/team-directory/blob/master/index.html

## Tests

To run tests locally, you'll need create a writeable file called `.env.sh` with 
the following contents:

```sh
export GitHubToken="GITHUB TOKEN"
export account="ACCOUNT NAME"
export repo="REPO NAME"
export team="TEAM FILENAME"
export form="FORM FILENAME"
```

_Note:_ you can optionally add `export branch="BRANCH NAME"` if test data lies in a
specific branch.

Run tests via

    npm run test-local

## Deploying

- `git run build`
- Add entry to [CHANGELOG](https://github.com/mapbox/team-directory/blob/master/CHANGELOG.md)
- Update the version key in [package.json](https://github.com/mapbox/team-directory/blob/master/package.json#L3)
- Commit and push
- `git tag -a vX.X.X -m 'vX.X.X'`
- `git push --tags`
- `npm publish`
