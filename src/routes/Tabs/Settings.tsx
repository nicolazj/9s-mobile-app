import { createStackNavigator } from 'react-navigation';

import SettingsScreen from '../../screens/Settings';
import UpdateCompany from '../../screens/UpdateCompany';
import UpdateProfile from '../../screens/UpdateProfile';
import { IThemeInterface, th } from '../../styled';
import { SCREENS } from '../constants';
import { getTabNavOpts } from './helper';

const SettingsStack = createStackNavigator(
  {
    [SCREENS[SCREENS.SETTINGS]]: {
      screen: SettingsScreen,
      navigationOptions: { title: 'Settings' },
    },
    [SCREENS[SCREENS.UPDATE_PROFILE]]: {
      screen: UpdateProfile,
      navigationOptions: { title: 'Update user profile' },
    },
    [SCREENS[SCREENS.UPDATE_COMPANY]]: {
      screen: UpdateCompany,
      navigationOptions: { title: 'Update company' },
    },
  },
  {
    initialRouteName: SCREENS[SCREENS.SETTINGS],
    defaultNavigationOptions: (props: any) => {
      return {
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: th('color.header')(props.screenProps as {
            theme: IThemeInterface;
          }),
        },
      };
    },
    navigationOptions: getTabNavOpts({ title: 'Settings', icon: 'options' }),
  }
);

export default SettingsStack;
