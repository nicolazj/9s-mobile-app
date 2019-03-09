import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Loading from '../screens/Loading';
import Onboarding from '../screens/Onboarding';
import Auth from './Auth';
import { SCREENS } from './constants';
import ForceConnect from './ForceConnect';
import Tabs from './Tabs';

const MainNavigator = createSwitchNavigator(
  {
    Tabs,
    ForceConnect,
    Auth,
    [SCREENS[SCREENS.LOADING]]: Loading,
    [SCREENS[SCREENS.ONBOARDING]]: Onboarding,
  },
  {
    initialRouteName: SCREENS[SCREENS.LOADING],
  }
);

export default createAppContainer(MainNavigator);
