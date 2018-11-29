import { Constants } from 'expo';
import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenProp } from 'react-navigation';
import { Container as UnContainer } from 'unstated';
import agent from '../agent';
import { FormikTextInput } from '../primitives';
import { GoogleButton } from '../primitives';
import { Button, Container, Delimiter, FormTitle, Link, SafeArea, Text } from '../primitives';
import { SCREENS } from '../routes/constants';
import ActivityStatus from '../states/ActivityStatus';
import { SubscribeHOC } from '../states/helper';
import { SignInPayload } from '../types';
import { object, password, username } from '../validations';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  containers: Array<UnContainer<any>>;
}

class SignIn extends React.Component<Props> {
  public onPress = async (values: SignInPayload) => {
    const [activityStatus] = this.props.containers;

    try {
      (activityStatus as ActivityStatus).show('Logging in');
      await agent.token.login(values);
      const companies = await agent.user.company.list();
      if (companies.length === 1) {
        await agent.token.exchange(companies[0].companyUuid);
        this.props.navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
      } else {
        // FIXME companies
      }
    } catch (err) {
      Alert.alert('Log in failed', 'Unable to sign in, try again later');
    } finally {
      (activityStatus as ActivityStatus).dismiss();
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
export default SubscribeHOC([ActivityStatus])(SignIn);
