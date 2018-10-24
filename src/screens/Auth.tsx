import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Center, TextInput, SafeArea, FormTitle } from '../primitives';
import agent from '../agent';
import auth from '../states/Auth';
import { LoginPayload } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class Auth extends React.Component<Props> {
  onPress = async (values: LoginPayload) => {
    try {
      const user = await agent.basic.login(values);

      await auth.setUser(user);
      const companies = await agent.user.company.list();
      if (companies.length === 1) {
        await agent.user.exchange(companies[0].companyUuid);
      }
      await this.props.navigation.navigate('Main');
    } catch (err) {}
  };

  render() {
    return (
      <SafeArea>
        <Formik
          initialValues={{
            username: 'nicolas.jiang@9spokes.com',
            password: 'Qwer1234',
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().required('Required'),
          })}
          onSubmit={this.onPress}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <Center>
              <FormTitle>Login</FormTitle>

              <TextInput onChangeText={handleChange('username')} value={values.username} />

              {errors.username && touched.username && <Text style={{ textAlign: 'left' }}>{errors.username}</Text>}
              <TextInput onChangeText={handleChange('password')} value={values.password} secureTextEntry={true} />
              <Button title="Sign in" onPress={handleSubmit} />
            </Center>
          )}
        </Formik>
      </SafeArea>
    );
  }
}
