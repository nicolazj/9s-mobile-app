import { createSwitchNavigator } from 'react-navigation';

import Tabs from './Tabs';
import Loading from '../screens/Loading';
import Auth from '../screens/Auth';

export default createSwitchNavigator(
  {
    Tabs,
    Loading,
    Auth,
  },
  {
    initialRouteName: 'Loading',
  }
);
