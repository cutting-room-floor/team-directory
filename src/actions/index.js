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

function setTeam(team) {
  return {
    type: types.TEAM,
    team
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
  return (dispatch) => {
    if (typeof error === 'object') error = JSON.parse(error.message).message;
    dispatch(isLoading(false));
    dispatch({
      type: types.ERROR,
      error
    });
  }
}

export function setValidators(validators) {
  return {
    type: types.VALIDATORS,
    validators
  };
}

export function setStatsTemplate(statsTemplate) {
  return {
    type: types.STATS_TEMPLATE,
    statsTemplate
  };
}

export function setListingTemplate(listingTemplate) {
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
  repo = client.repos(options.account, options.repo);

  return {
    type: types.OPTIONS,
    options
  }
}

export function addUser(obj, cb) {
  return (dispatch, getState) => {
    const { options, team } = getState().directory;
    const config = {};
    if (options.branch) config.ref = options.branch;

    dispatch(isLoading(true));

    repo.contents(options.team).fetch(config).then((res) => {

      const dataFromGitHub = JSON.parse(Base64.decode(res.content));
      dataFromGitHub.push(obj); // New record

      const payload = JSON.stringify(dataFromGitHub, null, 2) + '\n';
      const putData = {
        message: 'Created ' + obj.github,
        content: Base64.encode(payload),
        sha: res.sha
      };

      if (options.branch) putData.branch = options.branch;

      repo.contents(options.team).add(putData)
        .then(() => {
          dispatch(setFilter(dataFromGitHub));
          dispatch(setTeam(dataFromGitHub));
          dispatch(eventEmit('user.created', { user: obj }));
          dispatch(isLoading(false));
          cb(null);
        }).catch((err) => { cb(err); });
    }).catch((err) => { cb(err); });
  }
}

export function updateUser(obj, cb) {
  return (dispatch, getState) => {
    const { options, team } = getState().directory;
    const config = {};
    if (options.branch) config.ref = options.branch;
    dispatch(isLoading(true));

    repo.contents(options.team).fetch(config).then((res) => {
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

      if (options.branch) putData.branch = options.branch;

      repo.contents(options.team).add(putData)
        .then(() => {
          dispatch(setFilter(dataFromGitHub));
          dispatch(setTeam(dataFromGitHub));
          dispatch(eventEmit('user.updated', { user: obj }));
          dispatch(isLoading(false));
          cb(null);
        }).catch((err) => { cb(err); });
    }).catch((err) => { cb(err); });
  }
}

export function removeUser(username, cb) {
  return (dispatch, getState) => {
    const { options, team } = getState().directory;
    const config = {};
    if (options.branch) config.ref = options.branch;
    dispatch(isLoading(true));

    repo.contents(options.team).fetch(config).then((res) => {
      let user;
      const dataFromGitHub = JSON.parse(Base64.decode(res.content)).filter((d) => {
        if (username.toLowerCase() === d.github.toLowerCase()) {
          user = d;
          return false;
        } else {
          return true;
        }
      });

      const payload = JSON.stringify(dataFromGitHub, null, 2) + '\n';
      const putData = {
        message: 'Removed ' + username,
        content: Base64.encode(payload),
        sha: res.sha
      };

      if (options.branch) putData.branch = options.branch;

      repo.contents(options.team).add(putData)
        .then(() => {
          dispatch(setFilter(dataFromGitHub));
          dispatch(setTeam(dataFromGitHub));
          dispatch(eventEmit('user.removed', { user: user }));
          dispatch(isLoading(false));
          cb(null);
        }).catch((err) => { cb(err); });
      }).catch((err) => { cb(err); });
  }
}

export function loadForm() {
  return (dispatch, getState) => {
    const { options } = getState().directory;
    const config = {};
    dispatch(isLoading(true));
    if (options.branch) config.ref = options.branch;

    repo.contents(options.form).read(config)
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
        dispatch(isLoading(false));
      })
      .catch((err) => {
        dispatch(setError(err));
        dispatch(setForm([]));
      });
  };
}

export function loadUser(u) {
  return (dispatch, getState) => {
    const { team } = getState().directory;
    const user = team.filter((d) => {
      return u.toLowerCase() === d.github.toLowerCase();
    })[0];

    dispatch(eventEmit('user.editing', { user: user }));
    dispatch({
      type: types.USER,
      user
    });
  };
}

export function loadTeam(query) {
  return (dispatch, getState) => {
    const { options } = getState().directory;
    const config = {};
    if (options.branch) config.ref = options.branch;

    repo.contents(options.team).read(config)
      .then((data) => {
        data = JSON.parse(data);

        client.user.fetch(config)
          .then((user) => {

            data.forEach((d) => {
              if (d.github.toLowerCase() === user.login.toLowerCase() && d.admin) {
                user.admin = true;
              }
            });

            dispatch(setActor(user));
            dispatch(setFilter(data));
            dispatch(setTeam(data));
            dispatch(eventEmit('load', { team: data, user: user }));
            dispatch(isLoading(false));
          });
      })
      .catch((err) => {
        dispatch(setError(err));
        dispatch(setTeam([]));
        dispatch(setFilter([]));
      });
  };
}

export function teamSort(sortIndex) {
  return (dispatch, getState) => {
    const { sorts, filterList } = getState().directory;
    dispatch(setFilter(sorts[sortIndex].sort(filterList)));
  }
}

export function teamFilter(query) {
  return (dispatch, getState) => {
    const { options, team } = getState().directory;

    if (query.length > 2) {
      query = decodeURIComponent(removeDiacritics(query.toLowerCase()));
      dispatch(setFilter(team.filter((d) => {
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
      dispatch(setFilter(team));
    }
  }
}

function sorts(sorts) {
  return {
    type: types.SORTS,
    sorts
  };
}

function sortKeys(sortKeys) {
  return {
    type: types.SORT_KEYS,
    sortKeys
  };
}

export function setSorts(arr) {
  return (dispatch) => {
    dispatch(sorts(arr));
    dispatch(sortKeys(arr.reduce((memo, sort) => {
      memo.push(sort.key);
      return memo;
    }, [])));
  }
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

export function eventSubscribe(type, fn) {
  return (dispatch, getState) => {
    const { events } = getState().directory;
    events[type] = events[type] || [];
    events[type].push(fn);
    return {
      type: types.EVENTS,
      events
    };
  }
}

export function eventEmit(type, data) {
  return (dispatch, getState) => {
    const { events } = getState().directory;

    if (!events[type]) {
      return {
        type: types.EVENTS,
        events
      }
    }

    const listeners = events[type].slice();

    for (var i = 0; i < listeners.length; i++) {
      listeners[i].call(this, data);
    }
  }
}

export function isLoading(loading) {
  return {
    type: types.LOADING,
    loading
  };
}
