import { Constants } from 'expo';
import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenProp } from 'react-navigation';
import agent from '../../agent';
import Button from '../../components/Button';
import Delimiter from '../../components/Delimiter';
import Link from '../../components/Link';
import { GoogleButton } from '../../components/SocialButton';
import { FormikTextInput, FormTitle } from '../../formik';
import { Container, SafeArea, Text } from '../../primitives';
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
  public onPress = async (values: SignUpPayload) => {
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
  public googleLogin() {
    console.log('google login');
  }
  public render() {
    return (
      <Container>
        <SafeArea>
          <KeyboardAwareScrollView extraHeight={Constants.statusBarHeight}>
            <Container padding={true}>
              <Formik
                initialValues={{
                  userName:
                    Math.random()
                      .toString(36)
                      .substring(7) + '@gmail.com',
                  password: 'Qwer1234',
                  firstName: 'n',
                  lastName: 'j',
                }}
                validationSchema={object().shape({
                  firstName: name,
                  lastName: name,
                  password,
                  userName: username,
                })}
                onSubmit={this.onPress}>
                {({ handleSubmit }) => (
                  <View style={{ flex: 1 }}>
                    <FormTitle style={{ marginBottom: 20 }}>Create an account</FormTitle>
                    <Field name="firstName" component={FormikTextInput} placeholder="First name" />
                    <Field name="lastName" component={FormikTextInput} placeholder="Last name" />
                    <Field name="userName" component={FormikTextInput} placeholder="Email" />
                    <Field name="password" component={FormikTextInput} placeholder="Password" secureTextEntry={true} />
                    <Button title="Proceed" onPress={handleSubmit} />
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
            <Text>Already have an account? </Text>
            <Link title="Log in" onPress={() => this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN])} />
          </View>
        </SafeArea>
      </Container>
    );
  }
}
export default SubscribeHOC([activityStatusState])(SignUp);
