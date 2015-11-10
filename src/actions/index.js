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

export function setOptions(options) {
  client = new Octokat({ token: options.token });
  repo = client.repos(options.org, options.repo);
  config = Object.assign({}, config, options);
}

export function loadPeople(query) {
  const filter = (query && query.filter) ? query.filter : null;
  const sort = (query && query.sort) ? query.sort : 'name';

  return (dispatch) => {
    repo.contents(config.data.people).read()
      .then((data) => {
        data = JSON.parse(data);
        console.log('Data', data);
      })
      .catch((err) => {
        dispatch(setPeople([]));
      });

    dispatch(setPeople([]));
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
