import * as React from 'react';
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
  componentDidMount() {
    this.onPress();
  }
  onPress = async () => {
    const user = await client.login(this.state);
    if (client.user) {
      const companies = await client.user.company.list();
      if (companies.length === 1) {
        await client.auth(companies[0].companyUuid);
      }
    }
    await this.props.navigation.navigate('Main');
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
