import React from 'react';
import { createStackNavigator, NavigationScreenProps } from 'react-navigation';

import * as P from '../primitives';
import AppConnect from '../screens/AppConnect';
import AppDetail from '../screens/AppDetail';
import ForceConnect from '../screens/ForceConnect';
import authState, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import styled, { th } from '../styled';
import { SCREENS } from './constants';

const LogoutBtn = styled(P.Touchable)`
  padding: 10px;
`;
const LogoutText = styled(P.Text)`
  color: ${th('color.main')};
`;

const Logout_: React.FC<{ states: [AuthState]; navProps: NavigationScreenProps }> = ({
  states,
  navProps: { navigation },
}) => (
  <LogoutBtn
    onPress={() => {
      const [authState] = states;
      authState.clear();
      navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
    }}>
    <LogoutText>Log out</LogoutText>
  </LogoutBtn>
);
const Logout = SubscribeHOC([authState])(Logout_) as React.FC<{ navProps: NavigationScreenProps }>;

export default createStackNavigator(
  {
    [SCREENS[SCREENS.FORCE_CONNECT]]: {
      screen: ForceConnect,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          title: props.navigation.getParam('key'),
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0,
          },

          headerLeft: <Logout navProps={props} />,
        };
      },
    },
    [SCREENS[SCREENS.APP_DETAIL]]: {
      screen: AppDetail,
      navigationOptions: (props: NavigationScreenProps) => {
        return {
          title: props.navigation.getParam('key'),
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0,
          },
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
  {}
);
