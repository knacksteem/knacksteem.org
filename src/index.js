import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import './assets/styles/index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

render(<Provider store={store}>
  <ConnectedRouter history={history}>
    <div>
      <App />
    </div>
  </ConnectedRouter>
</Provider>, document.getElementById('root'));

registerServiceWorker();
