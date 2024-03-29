import React from 'react';

import ActivityIndicator from './components/ActivityIndicator';
import * as P from './primitives';
import Main from './routes/Main';
import { IThemeInterface, ThemeProvider, withTheme } from './styled';
import tenant from './tenant';

const App = withTheme(({ theme }: { theme: IThemeInterface }) => (
  <Main screenProps={{ theme }} />
));

export default () => {
  return (
    <ThemeProvider theme={tenant.theme}>
      <P.Container>
        <App />
        <ActivityIndicator />
      </P.Container>
    </ThemeProvider>
  );
};
