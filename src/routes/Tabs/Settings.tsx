import { createStackNavigator } from 'react-navigation';
import { IThemeInterface, th } from '../../styled';

import SettingsScreen from '../../screens/Settings';
import { getTabNavOpts } from './helper';

const SettingsStack = createStackNavigator(
  {
    Settings: { screen: SettingsScreen, navigationOptions: { title: 'Settings' } },
  },
  {
    navigationOptions: (props: any) => {
      return {
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: th('color.header')(props.screenProps as { theme: IThemeInterface }),
        },
      };
    },
  }
);

SettingsStack.navigationOptions = getTabNavOpts({ title: 'Settings', icon: 'options' });

export default SettingsStack;
