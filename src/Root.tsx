import React from 'react';
import { Provider } from 'unstated';
import ActivityIndicator from './components/ActivityIndicator';
import { Container } from './primitives';
import Main from './routes/Main';
import apps from './states/Apps';
import { IThemeInterface, ThemeProvider, withTheme } from './styled';
import tenant from './tenant';

const App = withTheme(({ theme }: { theme: IThemeInterface }) => <Main screenProps={{ theme }} />);

export default () => (
  <Provider inject={[apps]}>
    <ThemeProvider theme={tenant.theme}>
      <Container>
        <App />
        <ActivityIndicator />
      </Container>
    </ThemeProvider>
  </Provider>
);
