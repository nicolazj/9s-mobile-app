import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { SCREENS } from '../routes/constants';
import auth from '../states/Auth';
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class AuthLoadingScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  public bootstrapAsync = async () => {
    // await AsyncStorage.clear();
    const loggedIn = auth.isLoggedIn();
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
}
