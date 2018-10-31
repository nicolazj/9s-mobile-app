import React from 'react';
import { Constants } from 'expo';
import { View, Alert } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Delimiter, SafeArea, FormTitle, Container, Button, Text, Link } from '../primitives';
import { GoogleButton } from '../primitives';
import { FormikTextInput } from '../primitives';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import agent from '../agent';
import auth from '../states/Auth';
import { LoginPayload } from '../types';
import { SCREENS } from '../routes/constants';

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
        const companyUuid = companies[0].companyUuid;
        await auth.setState({ companyUuid });
        const companyAuth = await agent.user.exchange(companyUuid);
        await auth.setState({ companyAuth });
      }
      this.props.navigation.navigate('Dashboard');
    } catch (err) {
      Alert.alert('Log in failed', 'Unable to sign in, try again later');
    }
  };

  render() {
    return (
      <Container>
        <SafeArea>
          <KeyboardAwareScrollView extraHeight={Constants.statusBarHeight}>
            <Container padding={true}>
              <Formik
                initialValues={{
                  username: 'nicolas.jiang@9spokes.com',
                  password: 'Qwer1234',
                }}
                validationSchema={Yup.object().shape({
                  username: Yup.string().required('Required'),
                  password: Yup.string().required('Required'),
                })}
                onSubmit={this.onPress}
              >
                {({ handleSubmit }) => (
                  <View style={{ flex: 1 }}>
                    <FormTitle style={{ marginBottom: 20 }}>Sign up</FormTitle>
                    <Field name="username" component={FormikTextInput} placeholder="Email" />
                    <Field name="password" component={FormikTextInput} placeholder="Password" />
                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                      <Text>Can't Log In? </Text>
                      <Link
                        title="Reset Password"
                        onPress={() => {
                          this.props.navigation.navigate(SCREENS[SCREENS.RESET_PWD]);
                        }}
                      />
                    </View>

                    <Button title="Proceed" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
              <Delimiter />
              <GoogleButton onPress={() => {}} />
            </Container>
          </KeyboardAwareScrollView>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 15,
              justifyContent: 'center',
              position: 'absolute',
              bottom: 20,
              width: '100%',
            }}
          >
            <Text>Already have an account? </Text>
            <Link title="Log in" onPress={() => this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN])} />
          </View>
        </SafeArea>
      </Container>
    );
  }
}
