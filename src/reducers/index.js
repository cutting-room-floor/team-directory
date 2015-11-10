import * as types from '../constants/action_types.js';

const initialState = {
  options: {},
  people: [],
  message: '',
  error: ''
};

export default function data(state = initialState, action) {
  switch (action.type) {

    case types.PEOPLE:
      return Object.assign({}, state, {
      people: action.people
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
