import * as types from '../constants/action_types.js';

const initialState = {
  options: {
    org: '',
    repo: '',
    data: {
      people: '',
      form: '',
      links: ''
    }
  },
  validators: function(d, c) { return c(null); },
  normalizers: function(d, c) { return c(d); },
  actor: {},
  form: [],
  people: [],
  message: '',
  error: ''
};

export default function data(state = initialState, action) {
  switch (action.type) {

    case types.VALIDATORS:
      return Object.assign({}, state, {
      validators: action.validators
    });

    case types.NORMALIZERS:
      return Object.assign({}, state, {
      normalizers: action.normalizers
    });

    case types.OPTIONS:
      return Object.assign({}, state, {
      options: action.options
    });

    case types.ACTOR:
      return Object.assign({}, state, {
      actor: action.actor
    });

    case types.PEOPLE:
      return Object.assign({}, state, {
      people: action.people
    });

    case types.FORM:
      return Object.assign({}, state, {
      form: action.form
    });

    case types.MESSAGE:
      return Object.assign({}, state, {
      message: action.message
    });

    case types.ERROR:
      return Object.assign({}, state, {
      error: action.error
    });

    default:
      return state;
  }
}
