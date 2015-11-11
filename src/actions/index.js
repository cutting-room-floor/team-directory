import * as types from '../constants/action_types';
import Octokat from 'octokat';
import { Base64 } from 'js-base64';
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
    });
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
        console.log('whats the error?', err);
        dispatch(setForm([]));
      });
  };
}

export function loadPeople(query) {
  const filter = (query && query.filter) ? query.filter : null;
  const sort = (query && query.sort) ? query.sort : 'name';

  return (dispatch, getState) => {
    const { options } = getState().directory;
    client.user.fetch()
      .then((user) => {
        dispatch(setActor(user));
        repo.contents(options.people).read()
          .then((data) => {
            dispatch(setPeople(JSON.parse(data)));
          })
          .catch((err) => {
            console.log('An error occurred', err);
            dispatch(setPeople([]));
          });
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
