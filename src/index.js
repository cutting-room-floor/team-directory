import 'babel-core/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import thunk from 'redux-thunk';
import reducers from './reducers';

import App from './containers/app';
import Index from './containers/index';
import Edit from './containers/edit';
import New from './containers/new';
import NotFound from './components/notfound';
import { setOptions, setValidators, setNormalizers } from './actions';

const reducer = combineReducers(Object.assign({}, { directory: reducers }, {
  routing: routeReducer
}));

const store = applyMiddleware(thunk)(createStore)(reducer);
const history = createBrowserHistory();

export default class TeamDirectory {
  constructor(id, options) {
    syncReduxAndRouter(history, store);
    options = options || {};

    // Sets options passed from client
    store.dispatch(setOptions(options));

    const container = typeof id === 'string' ?
      document.getElementById(id) : id;

    render(
      <Provider store={store}>
        <Router history={history}>
          <Route path='/' component={App}>
            <IndexRoute component={Index} />
            <Route path='/edit/:user' component={Edit} />
            <Route path='/new' component={New} />
            <Route path='/*' component={NotFound} />
          </Route>
        </Router>
      </Provider>,
      container
    );
  }

  sorts(fn) {
    store.dispatch(setSorts(fn));
    return this;
  }

  /*
   * TeamDirectory.validators
   * Custom validation that's called before a team member is created or updated.
   *
   * @param {function} validation This function receives two arguments:
   * - `obj` The team member object.
   * - `callback` A callback function called in your code with either a
   * string messsage describing a validation error found or `null`
   * (no error found). Team member data will not be created/updated until
   * validation passes.
   * @returns this
   *
   * @example
   * var directions = (document.getElementById('app'), options);
   *
   * directions.validators = function(obj, callback) {
   *  if (obj.office === 'other' && !obj.city) {
   *    return callback('If the office selected is other, please enter your city');
   *  }
   *
   *  // No validation errors if it gets here
   *  return callback(null);
   * });
  */
  validators(fn) {
    store.dispatch(setValidators(fn));
    return this;
  }

  /*
   * TeamDirectory.normalizers
   * Format/normalize fields in a team member object before its created or updated.
   *
   * @param {function} normalization This function receives two arguments:
   * - `obj` The team member object
   * - `callback` A callback function called at the end of the function containing
   * a new normalized/formatted object. Team member data will not be
   * created/updated until this callback is called.
   * @returns this
   *
   * @example
   * var directions = (document.getElementById('app'), options);
   *
   * directions.normalization = function(obj, callback) {
   *  return callback(obj.map(function(data) {
   *
   *    // Remove any capitalization from an entered username.
   *    data.username = data.username.toLowerCase();
   *    return data;
   *  });
   * });
  */
  normalizers(fn) {
    store.dispatch(setNormalizers(fn));
    return this;
  }

  /*
   * TeamDirectory.listingTemplate
   * Creates a custom listing while called on each team member.
   *
   * @param {function} template This function recieves one argument:
   * - `obj` the current user in the list the template should be building out.
   * The return value of this function must be a `jsx` template.
   * @returns this
   *
   * @example
   * var directions = (document.getElementById('app'), options);
   *
   * directions.listingTemplate = function(obj) {
   *  var fullName = obj.fname + ' ' + obj.lname;
   *
   *  return (
   *    <div>
   *      <strong>{fullName}</strong>
   *      <em>{obj.birthday}</em>
   *    </div>
   *  );
   * });
  */
  listingTemplate(fn) {
    store.dispatch(setListingTemplate(fn));
    return this;
  }

  /*
   * TeamDirectory.statsTemplate
   * Evaluate team user data and present a template of found statistics.
   *
   * @param {function} template This function recieves one argument:
   * - `team` the team array of users.
   * The return value of this function must be a `jsx` template. if no
   * statsTemplate is provided, the teamStats link and modal will no be present
   * on the listing page.
   * @returns this
   *
   * @example
   * var directions = (document.getElementById('app'), options);
   *
   * directions.statsTemplate = function(team) {
   *  var length = team.length;
   *  var phones = team.filter(function(member) {
   *    return member.phone;
   *  }).length;
   *
   *  return (
   *    <div>
   *      <h2>Team stats</h2>
   *      <p>There are {length} total team members and {phones} have phones.
   *    </div>
   *  );
   * });
  */
  statsTemplate(fn) {
    store.dispatch(setStatsTemplate(fn));
    return this;
  }

  /*
   * Subscribe to a specified event with a listener function the latter gets
   * the data object that was passed to `fire` and additionally `target` and
   * `type` properties
   *
   * @param {string} type Event type
   * @param {Function} listener Function to be called when the event is fired
   * @returns this
  */
  on(type, fn) {
    this._events = this._events || {};
    this._events[type] = this._events[type] || [];
    this._events[type].push(fn);
    return this;
  }
}
