import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import agent from '../agent';
import { SCREENS } from '../routes/constants';
import auth from '../states/Auth';
import authState, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AuthState, UserState];
}

export class AuthLoadingScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  public bootstrapAsync = async () => {
    const loggedIn = await this.checkingLogin();
    this.props.navigation.navigate(SCREENS[loggedIn ? SCREENS.DASHBOARD : SCREENS.SIGN_IN]);
  };
  // Render any loading content that you like here
  public render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  private async checkingLogin() {
    const [_, userState] = this.props.states;

    const hasUserId = auth.hasUserId();
    if (!hasUserId) {
      return false;
    }
    try {
      const me = await agent.user.user.me();
      userState.setState({ me });
      return true;
    } catch (err) {
      return false;
    }
  }
}

export default SubscribeHOC([authState, userState])(AuthLoadingScreen);
