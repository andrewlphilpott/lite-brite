// Import React
import React from 'react';

// Import dependencies
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';

// Import styles
import './css/screen.css';

// Import components
import App from './app/components/App';

// Import stores
import store from './app/stores/';

// Routes
const router = (
  <HashRouter>
    <App store={store} />
  </HashRouter>
);

// Root DOM element
const rootEl = document.querySelector('#app');

render(router, rootEl);

console.log('v=0.0.2');