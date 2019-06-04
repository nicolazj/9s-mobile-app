import './src/base64';

import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React from 'react';
import { View } from 'react-native';
import Sentry from 'sentry-expo';

import { Ionicons } from '@expo/vector-icons';

import Root from './src/Root';

Sentry.config(
  'https://fb67f15df45e4a2ea788e003f7a7a501@sentry.io/1457806'
).install();

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
        ...(Ionicons as any).font,
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
