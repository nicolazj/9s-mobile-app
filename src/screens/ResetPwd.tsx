import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, Image, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import Button from '../components/Button';
import Link from '../components/Link';
import { FormDesc, FormikTextInput, FormTitle } from '../formik';
import log from '../logging';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { object, username } from '../validations';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class ResetPwd extends React.Component<Props> {
  state = {
    done: false,
  };
  onPress = async (values: { email: string }) => {
    try {
      await agent.public.password.reset(values.email);
      this.setState({ done: true });
    } catch (err) {
      log('reset error', err);
      Alert.alert('Reset password failed', 'try again later');
    }
  };

  render() {
    const { done } = this.state;
    return (
      <P.Container>
        <P.SafeArea>
          {done ? (
            <P.Container hasPadding hcenter vcenter>
              <Image
                style={{ width: 150, height: 150 }}
                source={{ uri: 'https://via.placeholder.com/150' }}
              />
              <FormTitle>Email sent!</FormTitle>
              <P.Text>Check your inbox for a link to </P.Text>
              <P.Text> reset your password</P.Text>
              <Link
                title="Done"
                onPress={() => {
                  this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
                }}
                style={{ margin: 20 }}
              />
            </P.Container>
          ) : (
            <P.Container hasPadding>
              <Formik
                initialValues={{
                  email: '',
                }}
                validationSchema={object().shape({
                  email: username,
                })}
                onSubmit={this.onPress}
              >
                {({ handleSubmit }) => (
                  <View>
                    <FormTitle style={{ marginBottom: 30 }}>
                      Reset your password
                    </FormTitle>
                    <FormDesc>
                      No problem! Enter your email address and we will send you
                      a link to reset your password
                    </FormDesc>
                    <Field
                      name="email"
                      component={FormikTextInput}
                      placeholder="Email"
                    />
                    <Button title="Reset password" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
            </P.Container>
          )}
        </P.SafeArea>
      </P.Container>
    );
  }
}
