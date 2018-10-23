import * as React from 'react';
import { View, Text, Button, AsyncStorage } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Center, TextInput } from '../primitives';
import client from '../client';
import auth from '../states/Auth';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class Auth extends React.Component<Props> {
  state = {
    username: 'nicolas.jiang@9spokes.com',
    password: 'Qwer1234',
  };
  componentDidMount() {}
  onPress = async () => {
    try {
      const user = await client.login(this.state);
      await auth.setUser(user);
      const companies = await client.user.company.list();
      if (companies.length === 1) {
        await client.user.company.auth(companies[0].companyUuid);
      }
      await this.props.navigation.navigate('Main');
    } catch (err) {
      console.log('err', JSON.stringify(err, null, 2));
    }
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
