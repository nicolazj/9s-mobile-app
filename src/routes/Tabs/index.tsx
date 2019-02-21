import { createBottomTabNavigator, createStackNavigator, NavigationScreenProps } from 'react-navigation';

import AppConnect from '../../screens/AppConnect';
import AppDetail from '../../screens/AppDetail';
import WidgetInfo from '../../screens/WidgetInfo';
import { IThemeInterface, th } from '../../styled';
import { SCREENS } from '../constants';
import DashboardStack from './Dashboard';
import MarketplaceStack from './Marketplace';
import SettingsStack from './Settings';

const Tabs = createBottomTabNavigator(
  {
    DashboardStack,
    MarketplaceStack,
    SettingsStack,
  },
  {
    lazy: false,
  }
);

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
    [SCREENS[SCREENS.APP_DETAIL]]: {
      screen: AppDetail,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          title: props.navigation.getParam('key'),
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: th('color.header')(props.screenProps as { theme: IThemeInterface }),
          },
        };
      },
    },
    [SCREENS[SCREENS.APP_CONNECT]]: {
      screen: AppConnect,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          title: props.navigation.getParam('key'),
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
