import React from 'react';
import { createStackNavigator } from 'react-navigation';

import WidgetList from '../../../screens/WidgetList';
import { SCREENS } from '../../constants';

export default createStackNavigator(
  { [SCREENS[SCREENS.WIDGET_LIST]]: WidgetList },
  {
    defaultNavigationOptions: {
      header: null,
    },
  }
);
