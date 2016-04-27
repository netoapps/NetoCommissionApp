import React from 'react';
import {render} from 'react-dom';
import AppDispatcher from './dispatcher/app-dispatcher.js';
import AppView from './views/app-view.jsx';

AppDispatcher.dispatch('APPINIT');

render(<AppView/>, document.getElementById('app'));