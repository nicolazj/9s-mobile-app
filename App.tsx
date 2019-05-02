import { AppLoading, Asset, Font } from 'expo';
import React from 'react';
import { View, Platform } from 'react-native';

import Icon from '@expo/vector-icons';

import Root from './src/Root';
import log from './src/logging';
interface State {
  isLoadingComplete: boolean;
}

export default class App extends React.Component<any, State> {
  state: State = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete) {
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
      Asset.loadAsync([require('./assets/ob1.mp4')]),
      Asset.loadAsync([require('./assets/ob2.mp4')]),
      Asset.loadAsync([require('./assets/ob3.mp4')]),
      Font.loadAsync({
        ...(Icon.Ionicons as any).font,
      }),
    ]).then(() => {
      return;
    });
  };

  handleLoadingError = (error: Error) => {
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
