import React from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import log from '../logging';
import { SCREENS } from '../routes/constants';
import authState, { AuthState } from '../states/Auth';
import cookieState, { CookieState } from '../states/Cookie';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AuthState, UserState, CookieState];
}

export class Logout extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.bootstrapAsync();
  }

  bootstrapAsync = async () => {
    const [authState_] = this.props.states;
    authState_.clear();
    cookieState.clear();
    AsyncStorage.clear();
    this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
  };
  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default SubscribeHOC([authState, userState, cookieState])(Logout);
