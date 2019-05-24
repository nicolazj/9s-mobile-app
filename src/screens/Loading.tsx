import React from 'react';
import {
    ActivityIndicator, Alert, AsyncStorage, StatusBar, View
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

export class AuthLoadingScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    try {
      const [, , cookieState] = this.props.states;
      const { onboarding } = cookieState.state;
      const loggedIn = await this.checkingLogin();
      if (loggedIn) {
        const companies = await agent.user.company.list();
        userState.setState({
          companies,
        });

        if (companies.length === 1) {
          await agent.token.exchange(companies[0].companyUuid);
          let connections = await agent.company.connection.list();
          if (connections.filter(conn => conn.status === 'ACTIVE').length > 0) {
            this.props.navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
          } else {
            this.props.navigation.navigate(SCREENS[SCREENS.FORCE_CONNECT]);
          }
        } else {
          this.props.navigation.navigate(SCREENS[SCREENS.SWITCH_COMPANY]);
        }
      } else if (!onboarding) {
        this.props.navigation.navigate(SCREENS[SCREENS.ONBOARDING]);
      } else this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
    } catch (err) {
      Alert.alert('please try again later');
      AsyncStorage.clear();
    }
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
      log(JSON.stringify(err, null, 2));
      return false;
    }
  }
}

export default SubscribeHOC([authState, userState, cookieState])(
  AuthLoadingScreen
);
