import { createStackNavigator } from 'react-navigation';

import SettingsScreen from '../../screens/Settings';
import { IThemeInterface, th } from '../../styled';
import { getTabNavOpts } from './helper';

const SettingsStack = createStackNavigator(
  {
    Settings: { screen: SettingsScreen, navigationOptions: { title: 'Settings' } },
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
    navigationOptions: getTabNavOpts({ title: 'Settings', icon: 'options' }),
  }
);

export default SettingsStack;
