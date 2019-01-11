import { createBottomTabNavigator, createStackNavigator, NavigationScreenProps } from 'react-navigation';

import WidgetInfo from '../../screens/WidgetInfo';
import { IThemeInterface, th } from '../../styled';
import { SCREENS } from '../constants';
import DashboardStack from './Dashboard';
import MarketplaceStack from './Marketplace';
import SettingsStack from './Settings';

const Tabs = createBottomTabNavigator({
  DashboardStack,
  MarketplaceStack,
  SettingsStack,
});

const TabsStack = createStackNavigator(
  {
    Tabs: {
      screen: Tabs,
      navigationOptions: {
        header: null,
      },
    },
    [SCREENS[SCREENS.WIDGET_INFO]]: {
      screen: WidgetInfo,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: th('color.header')(props.screenProps as { theme: IThemeInterface }),
          },
        };
      },
    },
  },
  {
    mode: 'modal',
  }
);

export default TabsStack;
