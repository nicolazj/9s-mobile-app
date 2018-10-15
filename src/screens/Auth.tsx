import React from 'react';
import { View, Text, Button, AsyncStorage } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Center, TextInput } from '../primitives';
import client from '../client';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class Auth extends React.Component<Props> {
  state = {
    username: 'nicolas.jiang@9spokes.com',
    password: 'Qwer1234',
  };
  onPress = async () => {
    console.log('sign in');
    const userClient = await client.login(this.state);
    const userInfo = await userClient.user.me();
    await AsyncStorage.setItem('userId', userInfo.userId);
    this.props.navigation.navigate('Main');

    console.log(userInfo);
  };

  render() {
    return (
      <Center>
        <Text>Login</Text>
        <TextInput onChangeText={username => this.setState({ username })} value={this.state.username} />
        <TextInput
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          secureTextEntry={true}
        />
        <Button title="Sign in" onPress={this.onPress} />
      </Center>
    );
  }
}
