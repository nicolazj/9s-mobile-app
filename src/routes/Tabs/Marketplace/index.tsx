import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator, TabBarTop } from 'react-navigation';
import { th, IThemeInterface } from '../../../styled';

import { getTabNavOpts } from '../helper';

import Apps from './Apps';
import Widgets from './Widgets';

const m = createMaterialTopTabNavigator(
  {
    Apps,
    Widgets,
  },
  {
    tabBarOptions: {
      upperCaseLabel: false,
      activeTintColor: '#111',
      inactiveTintColor: '#8a8a8a',
      style: {
        backgroundColor: '#EDEDED',
      },
      indicatorStyle: {
        backgroundColor: '#F6F6F6',
        height: '100%',
      },
    },
  }
);

const MarketplaceStack = createStackNavigator(
  {
    m: { screen: m, navigationOptions: { title: 'Marketplace' } },
  },
  {
    navigationOptions: props => {
      return {
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: th('color.header')(props.screenProps as { theme: IThemeInterface }),
        },
      };
    },
  }
);

MarketplaceStack.navigationOptions = getTabNavOpts({ title: 'Marketplace', icon: 'apps' });

export default MarketplaceStack;
