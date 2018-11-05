import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import * as Yup from 'yup';
import agent from '../agent';
import { Button, Container, FormDesc, FormTitle, SafeArea } from '../primitives';
import { FormikTextInput } from '../primitives';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class Auth extends React.Component<Props> {
  public onPress = async (values: { username: string }) => {
    try {
      const r = await agent.public.password.reset(values.username);
      console.log(r);
    } catch (err) {
      console.log(err);
      Alert.alert('Reset password failed', 'try again later');
    }
  };

  public render() {
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
              onSubmit={this.onPress}>
              {({ handleSubmit }) => (
                <View>
                  <FormTitle style={{ marginBottom: 30 }}>Reset your password</FormTitle>
                  <FormDesc>
                    No problem! Enter your email address and we will send you a link to reset your password
                  </FormDesc>
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
