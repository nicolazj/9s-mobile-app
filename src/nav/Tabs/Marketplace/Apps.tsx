import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import AppList from '../../../screens/AppList';
import AppDetail from '../../../screens/AppDetail';

export default createStackNavigator(
  {
    AppList,
    AppDetail,
  },
  {
    navigationOptions: {
      header: null,
    },
  }
);
