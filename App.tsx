import { AppLoading, Asset, Font } from 'expo';
import Icon from '@expo/vector-icons';
import React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import Root from './src/Root';
import auth from './src/states/Auth';
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
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Root />
        </View>
      );
    }
  }

  loadResourcesAsync = () => {
    return Promise.all([
      // auth.rehydrate(),
      Asset.loadAsync([require('./assets/google.png')]),
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
