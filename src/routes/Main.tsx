import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Loading from '../screens/Loading';
import Logout from '../screens/Logout';
import Onboarding from '../screens/Onboarding';
import SwitchCompany from '../screens/SwitchCompany';
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
    [SCREENS[SCREENS.SWITCH_COMPANY]]: SwitchCompany,
    [SCREENS[SCREENS.LOGOUT]]: Logout,
  },
  {
    initialRouteName: SCREENS[SCREENS.LOADING],
  }
);

export default createAppContainer(MainNavigator);
