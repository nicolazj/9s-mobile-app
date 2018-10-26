import * as React from 'react';
import { Provider } from 'unstated';
import { ThemeProvider } from './styled';
import App from './nav/App';
import { theme } from './tenant';

export default () => (
  <Provider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
);
