import * as types from '../constants/action_types';
import Octokat from 'octokat';
import { Base64 } from 'js-base64';
import diacritics from 'diacritics';
const removeDiacritics = diacritics.remove;
let client, repo, config = {};

function setActor(actor) {
  return {
    type: types.ACTOR,
    actor
  };
}

function setPeople(people) {
  return {
    type: types.PEOPLE,
    people
  };
}

function setFilter(filterList) {
  return {
    type: types.FILTER_LIST,
    filterList
  };
}

function setForm(form) {
  return {
    type: types.FORM,
    form
  };
}

export function setMessage(message) {
  return {
    type: types.MESSAGE,
    message
  };
}

export function setError(error) {
  if (typeof error === 'object') error = JSON.parse(error.message).message;
  return {
    type: types.ERROR,
    error
  };
}

export function setValidators(validators) {
  return {
    type: types.VALIDATORS,
    validators
  };
}

export function setStatsRenderer(statsTemplate) {
  return {
    type: types.STATS_TEMPLATE,
    statsTemplate
  };
}

export function setListingRenderer(listingTemplate) {
  return {
    type: types.LISTING_TEMPLATE,
    listingTemplate
  };
}

export function setNormalizers(normalizers) {
  return {
    type: types.NORMALIZERS,
    normalizers
  };
}

export function setOptions(options) {
  client = new Octokat({ token: options.GitHubToken });
  repo = client.repos(options.org, options.repo);

  return {
    type: types.OPTIONS,
    options
  }
}

export function addUser(obj, cb) {
  return (dispatch, getState) => {
    const { options, people } = getState().directory;
    repo.contents(options.people).fetch().then((res) => {

      const dataFromGitHub = JSON.parse(Base64.decode(res.content));
      dataFromGitHub.push(obj); // New record

      const payload = JSON.stringify(dataFromGitHub, null, 2) + '\n';
      const putData = {
        message: 'Created ' + obj.github,
        content: Base64.encode(payload),
        sha: res.sha
      };

      repo.contents(options.people).add(putData)
        .then(() => {
          dispatch(setPeople(dataFromGitHub));
          cb(null);
        }).catch((err) => { cb(err); });
    }).catch((err) => { cb(err); });
  }
}

export function updateUser(obj, cb) {
  return (dispatch, getState) => {
    const { options, people } = getState().directory;
    repo.contents(options.people).fetch().then((res) => {

      const dataFromGitHub = JSON.parse(Base64.decode(res.content)).map((d) => {
        if (obj.github.toLowerCase() === d.github.toLowerCase()) d = obj;
        return d;
      });

      const payload = JSON.stringify(dataFromGitHub, null, 2) + '\n';
      const putData = {
        message: 'Updated ' + obj.github,
        content: Base64.encode(payload),
        sha: res.sha
      };

      repo.contents(options.people).add(putData)
        .then(() => {
          dispatch(setPeople(dataFromGitHub));
          cb(null);
        }).catch((err) => { cb(err); });
    }).catch((err) => { cb(err); });
  }
}

export function removeUser(username, cb) {
  return (dispatch, getState) => {
    const { options, people } = getState().directory;
    repo.contents(options.people).fetch().then((res) => {

      const dataFromGitHub = JSON.parse(Base64.decode(res.content)).filter((d) => {
        return username.toLowerCase() !== d.github.toLowerCase();
      });

      const payload = JSON.stringify(dataFromGitHub, null, 2) + '\n';
      const putData = {
        message: 'Removed ' + username,
        content: Base64.encode(payload),
        sha: res.sha
      };

      repo.contents(options.people).add(putData)
        .then(() => {
          dispatch(setPeople(dataFromGitHub));
          cb(null);
        }).catch((err) => { cb(err); });
      }).catch((err) => { cb(err); });
  }
}

export function loadForm() {
  return (dispatch, getState) => {
    const { options } = getState().directory;
    repo.contents(options.form).read()
      .then((res) => {
        res = JSON.parse(res);
        let data = [];
        for (const prop in res) {
          data.push({
            section: prop,
            data: res[prop]
          });
        }
        dispatch(setForm(data));
      })
      .catch((err) => {
        dispatch(setError(err));
        dispatch(setForm([]));
      });
  };
}

export function loadUser(u) {
  return (dispatch, getState) => {
    const { people } = getState().directory;
    const user = people.filter((d) => {
      return u.toLowerCase() === d.github.toLowerCase();
    })[0];

    dispatch({
      type: types.USER,
      user
    });
  };
}

export function loadPeople(query) {
  return (dispatch, getState) => {
    const { options } = getState().directory;
    repo.contents(options.people).read()
      .then((data) => {
        data = JSON.parse(data);

        client.user.fetch()
          .then((user) => {

            data.forEach((d) => {
              if (d.github.toLowerCase() === user.login.toLowerCase() && d.admin) {
                user.admin = true;
              }
            });

            dispatch(setActor(user));
            dispatch(setFilter(data));
            dispatch(setPeople(data));
          });
      })
      .catch((err) => {
        dispatch(setError(err));
        dispatch(setPeople([]));
        dispatch(setFilter([]));
      });
  };
}

export function peopleSort(sortIndex) {
  return (dispatch, getState) => {
    const { sorts, filterList } = getState().directory;
    dispatch(setFilter(sorts[sortIndex].sort(filterList)));
  }
}

export function peopleFilter(query) {
  return (dispatch, getState) => {
    const { options, people } = getState().directory;

    if (query.length > 2) {
      query = decodeURIComponent(removeDiacritics(query.toLowerCase()));
      dispatch(setFilter(people.filter((d) => {
        const contains = options.filterKeys.some((field) => {
          if (typeof field === 'object') {

            let value = '';
            field.forEach(function(f) {
              if (d[f]) value += d[f] + ' ';
            });

            return removeDiacritics(value.toLowerCase()).indexOf(query) > -1;
          } else {
            return d[field] && removeDiacritics(d[field].toLowerCase()).indexOf(query) > -1;
          }
        });
        return contains;
      })));
    } else {
      dispatch(setFilter(people));
    }
  }
}

function sorts(sorts) {
  return {
    type: types.SORTS,
    sorts
  };
}

function sortKeys() {
  return {
    type: types.SORT_KEYS,
    sortKeys
  };
}

export function setSorts(sorts) {
  dispatch(sorts(sorts));
  dispatch(sortKeys(sorts.reduce((memo, sort) => {
    memo.push(sort.key);
    return memo;
  }, [])));
}

export function dismissError() {
  return (dispatch) => {
    dispatch(setError(''));
  };
}

export function dismissModal() {
  return (dispatch) => {
    dispatch(setMessage(''));
  };
}
