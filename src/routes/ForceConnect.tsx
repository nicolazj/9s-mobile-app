import { createStackNavigator, NavigationScreenProps } from 'react-navigation';

import AppConnect from '../screens/AppConnect';
import AppDetail from '../screens/AppDetail';
import ForceConnect from '../screens/ForceConnect';
import { IThemeInterface, th } from '../styled';
import { SCREENS } from './constants';

export default createStackNavigator(
  {
    [SCREENS[SCREENS.FORCE_CONNECT]]: {
      screen: ForceConnect,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          title: props.navigation.getParam('key'),
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0,
          },
        };
      },
    },
    [SCREENS[SCREENS.APP_DETAIL]]: {
      screen: AppDetail,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          title: props.navigation.getParam('key'),
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0,
          },
        };
      },
    },

    [SCREENS[SCREENS.APP_CONNECT]]: {
      screen: AppConnect,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          title: props.navigation.getParam('key'),
        };
      },
    },
  },
  {}
);
