import { createMaterialTopTabNavigator, createStackNavigator, NavigationScreenProps } from 'react-navigation';

import { IThemeInterface, th } from '../../../styled';
import { SCREENS } from '../../constants';

import AppConnect from '../../../screens/AppConnect';
import AppDetail from '../../../screens/AppDetail';
import { getTabNavOpts } from '../helper';

import Apps from './Apps';
import Widgets from './Widgets';

const Marketplace = createMaterialTopTabNavigator(
  {
    Apps,
    Widgets,
  },
  {
    swipeEnabled: false,
    tabBarOptions: {
      upperCaseLabel: false,
      activeTintColor: '#111',
      inactiveTintColor: '#8a8a8a',
      style: {
        backgroundColor: '#EDEDED',
      },
      indicatorStyle: {
        backgroundColor: '#F6F6F6',
        height: '100%',
      },
    },
  }
);

const MarketplaceStack = createStackNavigator(
  {
    [SCREENS[SCREENS.MARKETPLACE_HOME]]: { screen: Marketplace, navigationOptions: { title: 'Marketplace' } },
    [SCREENS[SCREENS.APP_DETAIL]]: {
      screen: AppDetail,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          title: props.navigation.getParam('key'),
        };
      },
    },
    [SCREENS[SCREENS.APP_CONNECT]]: {
      screen: AppConnect,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          title: props.navigation.getParam('key'),
        };
      },
    },
  },
  {
    defaultNavigationOptions: (props: any) => {
      return {
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: th('color.header')(props.screenProps as { theme: IThemeInterface }),
        },
      };
    },
    navigationOptions: getTabNavOpts({ title: 'Marketplace', icon: 'apps' }),
  }
);

export default MarketplaceStack;
