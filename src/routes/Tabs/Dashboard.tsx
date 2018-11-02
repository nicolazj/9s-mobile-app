import React from 'react';
import { createStackNavigator, NavigationBottomTabScreenOptions, NavigationScreenConfig } from 'react-navigation';

import DashboardScreen from '../../screens/Dashboard';
import { IThemeInterface, th } from '../../styled';
import { getTabNavOpts } from './helper';

const DashboardStack = createStackNavigator(
  {
    Dashboard: { screen: DashboardScreen, navigationOptions: { title: 'Dashboard' } },
  },
  {
    navigationOptions: (props) => {
      return {
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: th('color.header')(props.screenProps as { theme: IThemeInterface }),
        },
      };
    },
  },
);
DashboardStack.navigationOptions = getTabNavOpts({ title: 'Dashboard', icon: 'trending-up' });

export default DashboardStack;
