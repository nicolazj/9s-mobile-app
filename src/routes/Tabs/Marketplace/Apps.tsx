import { createStackNavigator } from 'react-navigation';

import AppList from '../../../screens/AppList';
import { SCREENS } from '../../constants';

export default createStackNavigator(
  {
    [SCREENS[SCREENS.APP_LIST]]: AppList,
  },
  {
    headerMode:'screen',
    defaultNavigationOptions: {
      header: null,
    },
  }
);
