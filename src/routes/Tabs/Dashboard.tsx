import React from 'react';
import { createStackNavigator, NavigationBottomTabScreenOptions, NavigationScreenConfig } from 'react-navigation';
import DashboardScreen from '../../screens/Dashboard';
import WidgetInfo from '../../screens/WidgetInfo';
import { IThemeInterface, th } from '../../styled';
import { SCREENS } from '../constants';
import { getTabNavOpts } from './helper';

const DashboardStack = createStackNavigator(
  {
    [SCREENS[SCREENS.DASHBOARD]]: { screen: DashboardScreen, navigationOptions: { title: 'Dashboard' } },
    [SCREENS[SCREENS.WIDGET_INFO]]: { screen: WidgetInfo },
  },
  {
    mode: 'modal',
    defaultNavigationOptions: (props: any) => {
      return {
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: th('color.header')(props.screenProps as { theme: IThemeInterface }),
        },
      };
    },
    navigationOptions: getTabNavOpts({ title: 'Dashboard', icon: 'trending-up' }),
  }
);

export default DashboardStack;
