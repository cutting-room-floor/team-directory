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
            <Route path='edit/:user' component={Edit} />
            <Route path='new' component={New} />
            <Route path='*' component={NotFound} />
          </Route>
        </Router>
      </Provider>,
      container
    );
  }

  validators(fn) {
    store.dispatch(setValidators(fn));
  }

  normalizers(fn) {
    store.dispatch(setNormalizers(fn));
  }
}
