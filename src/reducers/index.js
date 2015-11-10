import * as types from '../constants/action_types.js';

const initialState = {
  actor: {},
  form: [],
  people: [],
  message: '',
  error: ''
};

export default function data(state = initialState, action) {
  switch (action.type) {

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
