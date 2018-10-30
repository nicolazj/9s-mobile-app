import * as React from 'react';
import { Provider } from 'unstated';
import { ThemeProvider, withTheme, IThemeInterface } from './styled';
import Main from './nav/Main';
import { theme } from './tenant';
import apps from './states/Apps';

const App = withTheme(({ theme }: { theme: IThemeInterface }) => <Main screenProps={{ theme }} />);
export default () => (
  <Provider inject={[apps]}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
);
