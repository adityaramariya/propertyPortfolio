import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './routes';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import Request from 'axios';
import appConstant from './appConstant';


Request.defaults.baseURL = appConstant.baseURL;
const createStoreWithMiddleware = applyMiddleware()(createStore);
const store = createStoreWithMiddleware(reducers);

if (!String.prototype.includes) {
	// eslint-disable-next-line 
	String.prototype.includes = String.prototype.indexOf
}

ReactDOM.render(
	<Provider store={store}>
	  <Router routes={routes} history={hashHistory }/>  
	</Provider>

 , document.getElementById('root')
);
