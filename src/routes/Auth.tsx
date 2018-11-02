import { createStackNavigator, NavigationScreenProps } from 'react-navigation';
import ResetPwd from '../screens/ResetPwd';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import { IThemeInterface, th } from '../styled';
import { SCREENS } from './constants';

export default createStackNavigator(
  {
    [SCREENS[SCREENS.SIGN_IN]]: {
      screen: SignIn,
      navigationOptions: {
        header: null,
      },
    },
    [SCREENS[SCREENS.SIGN_UP]]: {
      screen: SignUp,
      navigationOptions: {
        header: null,
      },
    },
    [SCREENS[SCREENS.RESET_PWD]]: {
      screen: ResetPwd,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          headerStyle: {
            backgroundColor: th('color.view.bg')(props.screenProps as { theme: IThemeInterface }),
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0,
          },
        };
      },
    },
  },
  {
    mode: 'modal',
  },
);
