import React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import App from './src/nav/App';
import { Container } from './src/primitives';

interface Props {
  skipLoadingScreen: boolean;
}

export default class extends React.Component<Props> {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Container>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <App />
        </Container>
      );
    }
  }

  _loadResourcesAsync = () => {
    return Promise.all([
      Asset.loadAsync([
        // require('./assets/images/icon.png'),
        // require('./assets/images/splash.png'),
        // require('./assets/images/sage.png'),
        // require('./assets/images/wrike.png'),
        // require('./assets/images/zendesk.png'),
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        // 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),

        // fontawesome: require('./assets/fonts/fontawesome.ttf'),
      }),
    ]).then(() => {});
  };

  _handleLoadingError = (error: Error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
