import { createSwitchNavigator } from 'react-navigation';

import Loading from '../screens/Loading';
import Auth from './Auth';
import Tabs from './Tabs';

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
