import React from 'react';
import { View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { SCREENS } from '../routes/constants';

import { Button, Text } from '../primitives';
import auth from '../states/Auth';
interface Props {
  navigation: NavigationScreenProp<any, any>;
}
export default class Settings extends React.Component<Props> {
  public render() {
    return (
      <View>
        <Text>Settings</Text>
        <Button title="Log out" onPress={this.handleLogout} />
      </View>
    );
  }
  private handleLogout = () => {
    auth.clear();
    this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
  };
}
