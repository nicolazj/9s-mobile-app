import { AppLoading, Asset, Font } from 'expo';
import React from 'react';
import { View } from 'react-native';

import Icon from '@expo/vector-icons';

import Root from './src/Root';

interface Props {
  skipLoadingScreen: boolean;
}

export default class App extends React.Component<Props> {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Root />
        </View>
      );
    }
  }

  loadResourcesAsync = () => {
    return Promise.all([
      Asset.loadAsync([require('./assets/google.png')]),
      Asset.loadAsync([require('./assets/onboarding1.jpeg')]),
      Asset.loadAsync([require('./assets/onboarding2.jpeg')]),
      Asset.loadAsync([require('./assets/onboarding3.jpeg')]),
      Asset.loadAsync([require('./assets/onboarding4.jpeg')]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
      }),
    ]).then(() => {
      return;
    });
  };

  handleLoadingError = (error: Error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
