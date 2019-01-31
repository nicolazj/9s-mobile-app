import { createStackNavigator, NavigationScreenProps } from 'react-navigation';

import AppConnect from '../screens/AppConnect';
import AppDetail from '../screens/AppDetail';
import ForceConnect from '../screens/ForceConnect';
import { SCREENS } from './constants';

export default createStackNavigator({
  [SCREENS[SCREENS.FORCE_CONNECT]]: ForceConnect,
  [SCREENS[SCREENS.APP_DETAIL]]: {
    screen: AppDetail,
    navigationOptions: (props: NavigationScreenProps) => {
      return {
        title: props.navigation.getParam('key'),
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
});
