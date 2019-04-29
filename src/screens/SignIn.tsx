import { Constants } from 'expo';
import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import Button from '../components/Button';
import Delimiter from '../components/Delimiter';
import GoogleButton from '../components/GoogleButton';
import Link from '../components/Link';
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
class SignIn extends React.Component<Props> {
  refPassword = React.createRef<TextInput>();

  focusPassword = () => {
    if (this.refPassword.current) {
      this.refPassword.current.focus();
    }
  };
  onPress = async (values: SignInPayload) => {
    const [activityStatusState] = this.props.states;

    try {
      activityStatusState.show('Logging in');
      await agent.token.login(values);
      this.props.navigation.navigate(SCREENS[SCREENS.LOADING]);
    } catch (err) {
      if (err.response) {
        if (
          err.response.data.error_description === 'INVALID_USERNAME_OR_PASSWORD'
        ) {
          Alert.alert('Log in failed', 'Invalid username or password');
        }
      } else {
        console.log(err);
        Alert.alert('Log in failed', 'Unable to sign in, try again later');
      }
    } finally {
      activityStatusState.dismiss();
    }
  };

  render() {
    return (
      <P.Container>
        <P.SafeArea>
          <KeyboardAwareScrollView extraHeight={Constants.statusBarHeight}>
            <P.Container hasMargin>
              <Formik
                initialValues={{
                  username: __DEV__ ? 'pppp@gmail.com' : '',
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
                      innerRef={this.refPassword}
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
              <GoogleButton />
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
