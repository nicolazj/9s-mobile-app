import { AxiosError } from 'axios';
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
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import activityStatusState, {
  ActivityStatusState,
} from '../states/ActivityStatus';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';
import { SignInPayload } from '../types';
import { object, password, username } from '../validations';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [ActivityStatusState, UserState];
}
interface State {
  focus: string;
}
class SignIn extends React.Component<Props, State> {
  state: State = {
    focus: '',
  };
  passwordRef = React.createRef();
  onPress = async (values: SignInPayload) => {
    const [activityStatusState] = this.props.states;

    try {
      activityStatusState.show('Logging in');
      await agent.token.login(values);
      const companies = await agent.user.company.list();

      if (companies.length === 1) {
        await agent.token.exchange(companies[0].companyUuid);
        this.props.navigation.navigate(SCREENS[SCREENS.LOADING]);
      } else {
      }
    } catch (err) {
      if (err.response) {
        if (
          err.response.data.error_description === 'INVALID_USERNAME_OR_PASSWORD'
        ) {
          Alert.alert('Log in failed', 'Invalid username or password');
        }
      } else {
        Alert.alert('Log in failed', 'Unable to sign in, try again later');
      }
    } finally {
      activityStatusState.dismiss();
    }
  };
  googleLogin() {
    console.log('google login');
    Google.logInAsync({
      iosClientId:
        '248650621080-vp9dkt8bjb5d5bvlqhcfb4r54s4ip0r4.apps.googleusercontent.com',
      scopes: ['openid', 'email', 'profile', 'email', 'profile'],
    });
  }
  focusPassword = () => {
    this.passwordRef.current.focus();
  };
  render() {
    console.log(this.state.focus, 'focus');
    return (
      <P.Container>
        <P.SafeArea>
          <KeyboardAwareScrollView extraHeight={Constants.statusBarHeight}>
            <P.Container hasMargin>
              <Formik
                initialValues={{
                  username: __DEV__ ? 'ooo@gmail.com' : '',
                  password: __DEV__ ? 'Qwer1234' : '',
                }}
                validationSchema={object().shape({
                  password,
                  username,
                })}
                onSubmit={this.onPress}
              >
                {({ handleSubmit }) => (
                  <View style={{ flex: 1 }}>
                    <FormTitle style={{ marginBottom: 150 }}>Login</FormTitle>
                    <Field
                      name="username"
                      component={FormikTextInput}
                      placeholder="Email"
                      returnKeyType="next"
                      onSubmitEditing={this.focusPassword}
                    />

                    <Field
                      name="password"
                      component={FormikTextInput}
                      placeholder="Password"
                      secureTextEntry={true}
                      innerRef={this.passwordRef}
                      onSubmitEditing={handleSubmit}
                    />
                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                      <P.Text>Can't Log In? </P.Text>
                      <Link
                        title="Reset Password"
                        onPress={() => {
                          this.props.navigation.navigate(
                            SCREENS[SCREENS.RESET_PWD]
                          );
                        }}
                      />
                    </View>

                    <Button title="Sign in" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
              <Delimiter />
              <GoogleButton onPress={this.googleLogin} />
            </P.Container>
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
            <P.Text>Don't have an account? </P.Text>
            <Link
              title="Signup"
              onPress={() =>
                this.props.navigation.navigate(SCREENS[SCREENS.SIGN_UP])
              }
            />
          </View>
        </P.SafeArea>
      </P.Container>
    );
  }
}
export default SubscribeHOC([activityStatusState, userState])(SignIn);
