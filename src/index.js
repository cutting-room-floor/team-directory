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

  /*
   * TeamDirectory.sorts
   * Provide custom sort functions on the listings page.
   *
   * @param {array} sorts An array of objects containing a `key` name as string 
   * and a sort function that receives a current filtered list. The `key` must 
   * correspond to a key attribute in the form data and the `sort` function
   * should return the sorted array when complete. 
   * @returns this
   *
   * @example
   * var directions = (document.getElementById('app'), options);
   *
   * directions.sorts = [{
   *     key: 'date',
   *     sort: function(team) {
   *       return team.sort((a, b) => {
   *         a = new Date(a.birthday).getTime();
   *         b = new Date(b.birthday).getTime();
   *         return b - a;
   *       });
   *     }
   *   }, {
   *     key: 'name',
   *     return team.sort((a, b) => {
   *       a = (a.lname) ? a.lname.split(' ') : '';
   *       b = (b.lname) ? b.lname.split(' ') : '';
   *       a = a[1] ? a[1] : a[0];
   *       b = b[1] ? b[1] : b[0];
   *       return a.localeCompare(b);
   *     });
   *   }
   * }];
  */
  sorts(fn) {
    store.dispatch(setSorts(fn));
    return this;
  }

  validators(fn) {
    store.dispatch(setValidators(fn));
    return this;
  }

  normalizers(fn) {
    store.dispatch(setNormalizers(fn));
    return this;
  }

  listingTemplate(fn) {
    store.dispatch(setListingTemplate(fn));
    return this;
  }

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
