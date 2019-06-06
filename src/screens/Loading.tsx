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

export class AuthLoadingScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  componentDidMount() {
    this.bootstrapAsync();
  }

  bootstrapAsync = async () => {
    try {
      const [_, __, cookieState_] = this.props.states;

      const { onboarding } = cookieState_.state;

      const loggedIn = await this.checkingLogin();

      if (loggedIn) {
        this.props.navigation.navigate(SCREENS[SCREENS.SWITCH_COMPANY], {
          auto: true,
        });
      } else if (!onboarding) {
        this.props.navigation.navigate(SCREENS[SCREENS.ONBOARDING]);
      } else this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
    } catch (err) {
      Alert.alert('[loading]:please try again later');
      AsyncStorage.clear();
    }
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  async checkingLogin() {
    let [authState_, userState_] = this.props.states;

    const hasUserId = authState_.hasUserId();

    if (!hasUserId) {
      return false;
    }
    try {
      const me = await agent.user.user.me();
      userState_.setState({ me });
      const companies = await agent.user.company.list();
      userState_.setState({ companies });
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
