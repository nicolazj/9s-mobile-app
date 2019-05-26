import React from 'react';
import { createStackNavigator, NavigationScreenProps } from 'react-navigation';

import * as P from '../primitives';
import AppConnect from '../screens/AppConnect';
import AppDetail from '../screens/AppDetail';
import ForceConnect from '../screens/ForceConnect';
import styled, { IThemeInterface, th } from '../styled';
import { SCREENS } from './constants';

const LogoutBtn = styled(P.Touchable)`
  padding: 10px;
`;
const LogoutText = styled(P.Text)`
  color: ${th('color.main')};
`;

const Logout: React.FC<{
  navProps: NavigationScreenProps;
}> = ({ navProps: { navigation } }) => (
  <LogoutBtn
    onPress={() => {
      navigation.navigate(SCREENS[SCREENS.LOGOUT]);
    }}
  >
    <LogoutText>Log out</LogoutText>
  </LogoutBtn>
);

export default createStackNavigator(
  {
    [SCREENS[SCREENS.FORCE_CONNECT]]: {
      screen: ForceConnect,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          headerLeft: <Logout navProps={props} />,
        };
      },
    },
    [SCREENS[SCREENS.APP_DETAIL]]: {
      screen: AppDetail,
    },

    [SCREENS[SCREENS.APP_CONNECT]]: {
      screen: AppConnect,
    },
  },
  {
    defaultNavigationOptions: (props: any) => {
      return {
        title: props.navigation.getParam('key'),
        headerTintColor: th('color.header')(props.screenProps as {
          theme: IThemeInterface;
        }),

        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      };
    },
  }
);
