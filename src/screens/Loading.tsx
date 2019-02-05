import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import { SCREENS } from '../routes/constants';
import authState, { AuthState } from '../states/Auth';
import cookieState, { CookieState } from '../states/Cookie';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AuthState, UserState, CookieState];
}

export class AuthLoadingScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    const [, , cookieState] = this.props.states;
    const { onboarding } = cookieState.state;
    const loggedIn = await this.checkingLogin();
    if (loggedIn) {
      let connection = await agent.company.connection.list();
      if (connection.length > 0) {
        this.props.navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
      } else {
        this.props.navigation.navigate(SCREENS[SCREENS.FORCE_CONNECT]);
      }
    } else if (!onboarding) {
      this.props.navigation.navigate(SCREENS[SCREENS.ONBOARDING]);
    } else this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
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

  async checkingLogin() {
    const [authState, userState] = this.props.states;

    const hasUserId = authState.hasUserId();
    if (!hasUserId) {
      return false;
    }
    try {
      const me = await agent.user.user.me();
      userState.setState({ me });
      const companies = await agent.user.company.list();
      userState.setState({ companies });
      return true;
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      return false;
    }
  }
}

export default SubscribeHOC([authState, userState, cookieState])(AuthLoadingScreen);
