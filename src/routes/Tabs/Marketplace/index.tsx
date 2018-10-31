import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import { th, IThemeInterface } from '../../../styled';
import { SCREENS } from '../../constants';

import { getTabNavOpts } from '../helper';
import AppDetail from '../../../screens/AppDetail';

import Apps from './Apps';
import Widgets from './Widgets';

const m = createMaterialTopTabNavigator(
  {
    Apps,
    Widgets,
  },
  {
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
    [SCREENS[SCREENS.MARKETPLACE_HOME]]: { screen: m, navigationOptions: { title: 'Marketplace' } },
    [SCREENS[SCREENS.APP_DETAIL]]: {
      screen: AppDetail,
      navigationOptions: props => {
        return {
          title: props.navigation.getParam('key'),
        };
      },
    },
  },
  {
    navigationOptions: props => {
      return {
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: th('color.header')(props.screenProps as { theme: IThemeInterface }),
        },
      };
    },
  }
);

MarketplaceStack.navigationOptions = getTabNavOpts({ title: 'Marketplace', icon: 'apps' });

export default MarketplaceStack;
