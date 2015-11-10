import * as types from '../constants/action_types';
import Octokat from 'octokat';
let client, repo, config = {};

export function setMessage(message) {
  return {
    type: types.MESSAGE,
    message
  };
}

export function setError(error) {
  return {
    type: types.ERROR,
    error
  };
}

export function setPeople(people) {
  return {
    type: types.PEOPLE,
    people
  };
}

export function setForm(form) {
  return {
    type: types.FORM,
    form
  };
}

export function setOptions(options) {
  client = new Octokat({ token: options.GitHubToken });
  repo = client.repos(options.org, options.repo);
  config = Object.assign({}, config, options);
}

export function loadForm() {
  return (dispatch) => {
    repo.contents(config.data.form).read()
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

        console.log('whats the error?', err);

        dispatch(setForm([]));
      });
  };
}

export function loadPeople(query) {
  const filter = (query && query.filter) ? query.filter : null;
  const sort = (query && query.sort) ? query.sort : 'name';

  return (dispatch) => {
    repo.contents(config.data.people).read()
      .then((data) => {
        dispatch(setPeople(JSON.parse(data)));
      })
      .catch((err) => {
        dispatch(setPeople([]));
      });
  };
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
