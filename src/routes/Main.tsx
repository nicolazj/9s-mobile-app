import { createSwitchNavigator } from 'react-navigation';
import Loading from '../screens/Loading';
import Auth from './Auth';
import { SCREENS } from './constants';
import Tabs from './Tabs';

export default createSwitchNavigator(
  {
    Tabs,
    [SCREENS[SCREENS.LOADING]]: Loading,
    Auth,
  },
  {
    initialRouteName: SCREENS[SCREENS.LOADING],
  }
);
