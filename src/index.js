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
import {
  setSorts,
  setOptions,
  setValidators,
  setNormalizers,
  setListingTemplate,
  setStatsTemplate,
  eventSubscribe
} from './actions';

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

    const basePath = options.basePath || '/';

    render(
      <Provider store={store}>
        <Router history={history}>
          <Route path={basePath} component={App}>
            <IndexRoute component={Index} />
            <Route path={`${basePath}edit/:user`} component={Edit} />
            <Route path={`${basePath}new`} component={New} />
            <Route path={`${basePath}*`} component={NotFound} />
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

  on(type, fn) {
    store.dispatch(eventSubscribe(type, fn));
    return this;
  }
}
