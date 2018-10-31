import { createStackNavigator, NavigationScreenProps } from 'react-navigation';
import { SCREENS } from './constants';
import SignIn from '../screens/SignIn';
import ResetPwd from '../screens/ResetPwd';
import { th, IThemeInterface } from '../styled';

export default createStackNavigator(
  {
    [SCREENS[SCREENS.SIGN_IN]]: {
      screen: SignIn,
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
  }
);
