import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import store, {history} from './store';
import App from './App';
import {checkLoginData} from './actions/user';
import registerServiceWorker from './registerServiceWorker';

store.dispatch(checkLoginData());

render(<Provider store={store}>
  <ConnectedRouter history={history}>
    <App />
  </ConnectedRouter>
</Provider>, document.getElementById('root'));

registerServiceWorker();
