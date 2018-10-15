import { createSwitchNavigator } from 'react-navigation';

import Main from './Main';
import Loading from '../screens/Loading';
import Auth from '../screens/Auth';

export default createSwitchNavigator(
  {
    Main,
    Loading,
    Auth,
  },
  {
    initialRouteName: 'Loading',
  }
);
