import { Constants } from 'expo';
import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../../agent';
import Button from '../../components/Button';
import Delimiter from '../../components/Delimiter';
import GoogleButton from '../../components/GoogleButton';
import Link from '../../components/Link';
import { FormikTextInput, FormTitle } from '../../formik';
import * as P from '../../primitives';
import { SCREENS } from '../../routes/constants';
import activityStatusState, { ActivityStatusState } from '../../states/ActivityStatus';
import { SubscribeHOC } from '../../states/helper';
import { SignUpPayload } from '../../types';
import { name, object, password, username } from '../../validations';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [ActivityStatusState];
}

export class SignUp extends React.Component<Props> {
  refPassword = React.createRef<TextInput>();

  refEmail = React.createRef<TextInput>();

  refLastName = React.createRef<TextInput>();

  focusPassword = () => {
    if (this.refPassword.current) {
      this.refPassword.current.focus();
    }
  };
  focucLastName = () => {
    if (this.refLastName.current) {
      this.refLastName.current.focus();
    }
  };
  focusEmail = () => {
    if (this.refEmail.current) {
      this.refEmail.current.focus();
    }
  };

  onPress = async (values: SignUpPayload) => {
    const [activityStatusState] = this.props.states as [ActivityStatusState];

    try {
      activityStatusState.show('Checking email');
      const userExisted = await agent.public.user.isExisted(values.userName);
      if (!userExisted) {
        this.props.navigation.navigate(SCREENS[SCREENS.SIGN_UP_COMPANY], values);
      } else {
        Alert.alert('Error', 'Username existed');
      }
    } catch (err) {
      Alert.alert('Log in failed', 'Unable to sign in, try again later');
    } finally {
      activityStatusState.dismiss();
    }
  };

  render() {
    return (
      <P.Container>
        <P.SafeArea>
          <KeyboardAwareScrollView extraHeight={Constants.statusBarHeight}>
            <P.Container hasPadding>
              <Formik
                initialValues={
                  __DEV__
                    ? {
                        userName:
                          Math.random()
                            .toString(36)
                            .substring(7) + '@gmail.com',
                        password: 'Qwer1234',
                        firstName: 'n',
                        lastName: 'j',
                      }
                    : {
                        userName: '',
                        password: '',
                        firstName: '',
                        lastName: '',
                      }
                }
                validationSchema={object().shape({
                  firstName: name,
                  lastName: name,
                  password,
                  userName: username,
                })}
                onSubmit={this.onPress}
              >
                {({ handleSubmit }) => (
                  <View style={{ flex: 1 }}>
                    <FormTitle style={{ marginBottom: 20 }}>Create an account</FormTitle>
                    <Field
                      name="firstName"
                      component={FormikTextInput}
                      placeholder="First name"
                      returnKeyType="next"
                      onSubmitEditing={this.focucLastName}
                    />
                    <Field
                      name="lastName"
                      component={FormikTextInput}
                      placeholder="Last name"
                      innerRef={this.refLastName}
                      returnKeyType="next"
                      onSubmitEditing={this.focusEmail}
                    />
                    <Field
                      name="userName"
                      component={FormikTextInput}
                      placeholder="Email"
                      innerRef={this.refEmail}
                      returnKeyType="next"
                      onSubmitEditing={this.focusPassword}
                    />
                    <Field
                      name="password"
                      component={FormikTextInput}
                      placeholder="Password"
                      innerRef={this.refPassword}
                      secureTextEntry={true}
                      returnKeyType="next"
                      onSubmitEditing={handleSubmit}
                    />
                    <Button title="Proceed" onPress={handleSubmit} />
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
            <P.Text>Already have an account? </P.Text>
            <Link
              title="Log in"
              onPress={() => this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN])}
            />
          </View>
        </P.SafeArea>
      </P.Container>
    );
  }
}
export default SubscribeHOC([activityStatusState])(SignUp);
