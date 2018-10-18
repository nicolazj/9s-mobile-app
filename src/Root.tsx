import * as React from 'react';
import { Provider } from 'unstated';
import App from './nav/App';

import Auth from './states/Auth';
import client from './client';

let auth = new Auth();
client.auth = auth;

export default () => (
  <Provider inject={[auth]}>
    <App />
  </Provider>
);
