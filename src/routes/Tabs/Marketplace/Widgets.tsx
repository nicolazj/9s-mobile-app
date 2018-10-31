import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default createStackNavigator(
  { AppList: () => <View /> },
  {
    navigationOptions: {
      header: null,
    },
  }
);
