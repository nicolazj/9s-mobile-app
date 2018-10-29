import React from 'react';
import { View, ActivityIndicator, StatusBar, AsyncStorage } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import auth from '../states/Auth';
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class AuthLoadingScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const loggedIn = auth.isLoggedIn();
    this.props.navigation.navigate(loggedIn ? 'Tabs' : 'Auth');
  };
  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
