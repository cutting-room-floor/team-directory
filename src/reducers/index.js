import * as types from '../constants/action_types.js';
import initialState from '../initial_state.js';

export default function data(state = initialState, action) {
  switch (action.type) {

    case types.LISTING_TEMPLATE:
      return Object.assign({}, state, {
      listingTemplate: action.listingTemplate
    });

    case types.STATS_TEMPLATE:
      return Object.assign({}, state, {
      statsTemplate: action.statsTemplate
    });

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
      options: Object.assign({}, state.options, action.options)
    });

    case types.ACTOR:
      return Object.assign({}, state, {
      actor: action.actor
    });

    case types.USER:
      return Object.assign({}, state, {
      user: action.user
    });

    case types.PEOPLE:
      return Object.assign({}, state, {
      people: action.people
    });

    case types.FILTER_LIST:
      return Object.assign({}, state, {
      filterList: action.filterList
    });

    case types.SORTS:
      return Object.assign({}, state, {
      sorts: action.sorts
    });

    case types.SORT_KEYS:
      return Object.assign({}, state, {
      sortKeys: action.sortKeys
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
