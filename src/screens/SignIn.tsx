import { Constants, Google } from 'expo';
import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenProp } from 'react-navigation';
import agent from '../agent';
import Button from '../components/Button';
import Delimiter from '../components/Delimiter';
import Link from '../components/Link';
import { GoogleButton } from '../components/SocialButton';
import { FormikTextInput, FormTitle } from '../formik';
import { Container, SafeArea, Text } from '../primitives';
import { SCREENS } from '../routes/constants';
import activityStatusState, { ActivityStatusState } from '../states/ActivityStatus';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';
import { SignInPayload } from '../types';
import { object, password, username } from '../validations';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [ActivityStatusState, UserState];
}

class SignIn extends React.Component<Props> {
  public onPress = async (values: SignInPayload) => {
    const [activityStatusState, userState] = this.props.states;

    try {
      activityStatusState.show('Logging in');
      await agent.token.login(values);
      const companies = await agent.user.company.list();

      if (companies.length === 1) {
        await agent.token.exchange(companies[0].companyUuid);
        this.props.navigation.navigate(SCREENS[SCREENS.LOADING]);
      } else {
        // FIXME companies
      }
    } catch (err) {
      Alert.alert('Log in failed', 'Unable to sign in, try again later');
    } finally {
      activityStatusState.dismiss();
    }
  };
  public googleLogin() {
    console.log('google login');
    Google.logInAsync({
      iosClientId: '248650621080-vp9dkt8bjb5d5bvlqhcfb4r54s4ip0r4.apps.googleusercontent.com',
      scopes: ['openid', 'email', 'profile', 'email', 'profile'],
    });
  }
  public render() {
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
                validationSchema={object().shape({
                  password,
                  username,
                })}
                onSubmit={this.onPress}>
                {({ handleSubmit }) => (
                  <View style={{ flex: 1 }}>
                    <FormTitle style={{ marginBottom: 150 }}>Login</FormTitle>
                    <Field name="username" component={FormikTextInput} placeholder="Email" />

                    <Field name="password" component={FormikTextInput} placeholder="Password" secureTextEntry={true} />
                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                      <Text>Can't Log In? </Text>
                      <Link
                        title="Reset Password"
                        onPress={() => {
                          this.props.navigation.navigate(SCREENS[SCREENS.RESET_PWD]);
                        }}
                      />
                    </View>

                    <Button title="Sign in" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
              <Delimiter />
              <GoogleButton onPress={this.googleLogin} />
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
            }}>
            <Text>Don't have an account? </Text>
            <Link title="Signup" onPress={() => this.props.navigation.navigate(SCREENS[SCREENS.SIGN_UP])} />
          </View>
        </SafeArea>
      </Container>
    );
  }
}
export default SubscribeHOC([activityStatusState, userState])(SignIn);
