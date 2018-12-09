import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default createStackNavigator(
  { AppList: () => <View /> },
  {
    defaultNavigationOptions: {
      header: null,
    },
  }
);
