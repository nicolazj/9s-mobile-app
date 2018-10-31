import React from 'react';
import { View, Alert } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { SafeArea, FormTitle, FormDesc, Container, Button } from '../primitives';
import { FormikTextInput } from '../primitives';
import agent from '../agent';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class Auth extends React.Component<Props> {
  onPress = async (values: { username: string }) => {
    try {
      const r = await agent.basic.get_public_access();
      console.log(r);
      const { access_token } = r;
      const rr = await agent.basic.reset(values.username, access_token);

      console.log(rr);
    } catch (err) {
      console.log(err);
      Alert.alert('Reset password failed', 'try again later');
    }
  };

  render() {
    return (
      <Container>
        <SafeArea>
          <Container padding>
            <Formik
              initialValues={{
                username: '',
              }}
              validationSchema={Yup.object().shape({
                username: Yup.string().required('Required'),
              })}
              onSubmit={this.onPress}
            >
              {({ handleSubmit }) => (
                <View>
                  <FormTitle style={{ marginBottom: 30 }}>Reset your password</FormTitle>
                  <FormDesc>No problem! Enter your email address and we will send you a link to reset your password</FormDesc>
                  <Field name="username" component={FormikTextInput} placeholder="Email" />
                  <Button title="Reset password" onPress={handleSubmit} />
                </View>
              )}
            </Formik>
          </Container>
        </SafeArea>
      </Container>
    );
  }
}
