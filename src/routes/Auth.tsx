import { createStackNavigator, NavigationScreenProps } from 'react-navigation';

import Picker from '../screens/Picker';
import ResetPwd from '../screens/ResetPwd';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import SignUpCompany from '../screens/SignUp/Company';
import { IThemeInterface, th } from '../styled';
import { SCREENS } from './constants';

const signUp = createStackNavigator(
  {
    [SCREENS[SCREENS.SIGN_UP]]: {
      screen: SignUp,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          header: null,
        };
      },
    },
    [SCREENS[SCREENS.SIGN_UP_COMPANY]]: {
      screen: SignUpCompany,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          header: null,
        };
      },
    },
  },
  {}
);
export default createStackNavigator(
  {
    [SCREENS[SCREENS.SIGN_IN]]: {
      screen: SignIn,
      navigationOptions: {
        header: null,
      },
    },

    signUp: {
      screen: signUp,
    },
    [SCREENS[SCREENS.RESET_PWD]]: {
      screen: ResetPwd,
    },
    [SCREENS[SCREENS.PICKER]]: {
      screen: Picker,
    },
  },
  {
    mode: 'modal',
    defaultNavigationOptions: (props: NavigationScreenProps) => {
      return {
        headerTintColor: th('color.header')(props.screenProps as {
          theme: IThemeInterface;
        }),
        headerStyle: {
          backgroundColor: th('color.view.bg')(props.screenProps as {
            theme: IThemeInterface;
          }),
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
          borderBottomWidth: 0,
        },
      };
    },
  }
);
