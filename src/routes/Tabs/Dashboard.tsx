import React from 'react';
import { createStackNavigator } from 'react-navigation';

import * as P from '../../primitives';
import { scale } from '../../scale';
import DashboardScreen from '../../screens/Dashboard';
import ManageWidgetsScreen from '../../screens/ManageWidgets';
import { IThemeInterface, th } from '../../styled';
import { SCREENS } from '../constants';
import { getTabNavOpts } from './helper';

const DashboardStack = createStackNavigator(
  {
    [SCREENS[SCREENS.DASHBOARD]]: {
      screen: DashboardScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Dashboard',
        headerRightContainerStyle: {
          padding: scale(10),
        },
        headerRight: (
          <P.Touchable
            onPress={() => {
              console.log('h');
              navigation.navigate(SCREENS[SCREENS.MANAGE_WIDGETS]);
            }}>
            <P.Text style={{ color: '#fff' }}>Edit</P.Text>
          </P.Touchable>
        ),
      }),
    },
    [SCREENS[SCREENS.MANAGE_WIDGETS]]: { screen: ManageWidgetsScreen, navigationOptions: { title: 'Manage Widgets' } },
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
