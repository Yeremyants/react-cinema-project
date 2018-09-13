import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import App from './App';
import LoginPage from './containers/auth/LoginPage';

import HallsListPage from './containers/halls/HallsListPage';
import HallAddPage from './containers/halls/HallAddPage';
import HallEditPage from './containers/halls/HallEditPage';

import MoviesListPage from './containers/movies/MoviesListPage';
import MoviesAddPage from './containers/movies/MoviesAddPage';
import MoviesEditPage from './containers/movies/MoviesEditPage';

import cacheManager from 'services/cacheManager';

import * as reducers from './store/reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    combineReducers(reducers),
    composeEnhancers(applyMiddleware(thunk))
);

cacheManager.setVersion("0.0.2");

ReactDOM.render(
    <Provider store={ store }>

        <Router history={ browserHistory }>
            <Route path='login' component={ LoginPage } />
            <Route component={ App }>

                <Route path='halls' component={ HallsListPage } />
                <Route path='halls/add' component={ HallAddPage } />
                <Route path='halls/:id' component={ HallEditPage } />

                <Route path='movies' component={ MoviesListPage } />
                <Route path='movies/add' component={ MoviesAddPage } />
                <Route path='movies/:id' component={ MoviesEditPage } />

            </Route>

            <Redirect from='*' to='/halls'></Redirect>
        </Router>

    </Provider>,
    document.getElementById('root')
);
