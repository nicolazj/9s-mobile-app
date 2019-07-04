import Constants from 'expo-constants';
import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, TextInput, View } from 'react-native';
import {
    KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import { Header, NavigationScreenProp } from 'react-navigation';

import agent from '../../agent';
import Button from '../../components/Button';
import Delimiter from '../../components/Delimiter';
import GoogleButton from '../../components/GoogleButton';
import Link from '../../components/Link';
import { FormikTextInput, FormTitle } from '../../formik';
import log from '../../logging';
import * as P from '../../primitives';
import { SCREENS } from '../../routes/constants';
import { dismiss, show } from '../../stores/activityStatus';
import { SignUpPayload } from '../../types';
import { name, object, password, username } from '../../validations';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

const SignUp: React.FC<Props> = ({ navigation }) => {
  const refPassword = React.createRef<TextInput>();

  const refEmail = React.createRef<TextInput>();

  const refLastName = React.createRef<TextInput>();

  const focusPassword = () => {
    if (refPassword.current) {
      refPassword.current.focus();
    }
  };
  const focusLastName = () => {
    if (refLastName.current) {
      refLastName.current.focus();
    }
  };
  const focusEmail = () => {
    if (refEmail.current) {
      refEmail.current.focus();
    }
  };

  const onSubmit = async (values: SignUpPayload) => {
    try {
      show('Checking email');
      const userExisted = await agent.public.user.isExisted(values.userName);
      if (!userExisted) {
        navigation.navigate(SCREENS[SCREENS.SIGN_UP_COMPANY], values);
      } else {
        Alert.alert('Error', 'Username existed');
      }
    } catch (err) {
      log('sign up err', err);
      Alert.alert('Log in failed', 'Unable to sign up, try again later');
    } finally {
      dismiss();
    }
  };

  return (
    <P.Container>
      <P.SafeArea>
        <KeyboardAwareScrollView
          extraHeight={Constants.statusBarHeight + Header.HEIGHT}
          extraScrollHeight={10}
          enableOnAndroid
        >
          <P.Container hasMargin>
            <View>
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
                onSubmit={onSubmit}
              >
                {({ handleSubmit }) => (
                  <View style={{ flex: 1 }}>
                    <FormTitle style={{ marginBottom: 20 }}>
                      Create an account
                    </FormTitle>
                    <Field
                      name="firstName"
                      component={FormikTextInput}
                      placeholder="First name"
                      returnKeyType="next"
                      onSubmitEditing={focusLastName}
                    />
                    <Field
                      name="lastName"
                      component={FormikTextInput}
                      placeholder="Last name"
                      innerRef={refLastName}
                      returnKeyType="next"
                      onSubmitEditing={focusEmail}
                    />
                    <Field
                      name="userName"
                      component={FormikTextInput}
                      placeholder="Email"
                      innerRef={refEmail}
                      returnKeyType="next"
                      onSubmitEditing={focusPassword}
                    />
                    <Field
                      name="password"
                      component={FormikTextInput}
                      placeholder="Password"
                      innerRef={refPassword}
                      secureTextEntry={true}
                      returnKeyType="next"
                      onSubmitEditing={handleSubmit}
                    />
                    <Button title="Proceed" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
            </View>
            <Delimiter />
            <GoogleButton />
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 15,
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <P.Text>Already have an account? </P.Text>
              <Link
                title="Log in"
                onPress={() => navigation.navigate(SCREENS[SCREENS.SIGN_IN])}
              />
            </View>
          </P.Container>
        </KeyboardAwareScrollView>
      </P.SafeArea>
    </P.Container>
  );
};
export default SignUp;
