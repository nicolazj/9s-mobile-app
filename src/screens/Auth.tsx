import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import { Center, SafeArea, FormTitle, Content, Button } from '../primitives';
import { TextInput } from '../form';
import agent from '../agent';
import auth from '../states/Auth';
import { LoginPayload } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class Auth extends React.Component<Props> {
  onPress = async (values: LoginPayload) => {
    console.log(values);
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
        <Content>
          <Formik
            initialValues={{
              username: 'nicolas.jiang@9spokes.com',
              password: 'Qwer1234',
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().required('Required'),
              password: Yup.string().required('Required'),
            })}
            onSubmit={this.onPress}>
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <Center>
                <FormTitle>Login</FormTitle>
                <Field name="username" component={TextInput} placeholder="Email" />

                <Field name="password" component={TextInput} placeholder="Password" />

                <Button title="Sign in" onPress={handleSubmit} />
              </Center>
            )}
          </Formik>
        </Content>
      </SafeArea>
    );
  }
}
