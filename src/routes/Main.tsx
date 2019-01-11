import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Loading from '../screens/Loading';
import Auth from './Auth';
import { SCREENS } from './constants';
import Tabs from './Tabs';

const MainNavigator = createSwitchNavigator(
  {
    Tabs,
    [SCREENS[SCREENS.LOADING]]: Loading,

    Auth,
  },
  {
    initialRouteName: SCREENS[SCREENS.LOADING],
  }
);

export default createAppContainer(MainNavigator);
