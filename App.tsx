import './src/polyfill';

import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React from 'react';
import { View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { capture } from './src/logging';
import Root from './src/Root';

const App = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([require('./assets/google.png')]),
      Asset.loadAsync([require('./assets/ob1.mp4')]),
      Asset.loadAsync([require('./assets/ob2.mp4')]),
      Asset.loadAsync([require('./assets/ob3.mp4')]),
      Font.loadAsync({
        ...(Ionicons as any).font,
      }),
    ]);
    return;
  };

  const handleLoadingError = (error: Error) => {
    console.warn(error);
    capture(error);
  };

  const handleFinishLoading = () => {
    setIsLoaded(true);
  };

  if (!isLoaded) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={handleFinishLoading}
      />
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Root />
      </View>
    );
  }
};

export default App;
