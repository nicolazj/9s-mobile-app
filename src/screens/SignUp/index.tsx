import { Constants } from 'expo';
import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenProp } from 'react-navigation';
import { Container as UnContainer } from 'unstated';
import agent from '../../agent';
import Button from '../../components/Button';
import Delimiter from '../../components/Delimiter';
import Link from '../../components/Link';
import { GoogleButton } from '../../components/SocialButton';
import { FormikTextInput, FormTitle } from '../../formik';
import { Container, SafeArea, Text } from '../../primitives';
import { SCREENS } from '../../routes/constants';
import activityStatus, { ActivityStatus } from '../../states/ActivityStatus';
import { SubscribeHOC } from '../../states/helper';
import { SignUpPayload } from '../../types';
import { name, object, password, username } from '../../validations';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  containers: Array<UnContainer<object>>;
}

export class SignUp extends React.Component<Props> {
  public async componentDidMount() {
    await agent.token.public();
  }
  public onPress = async (values: SignUpPayload) => {
    const [activityStatus] = this.props.containers as [ActivityStatus];

    try {
      activityStatus.show('Checking email');
      const userExisted = await agent.public.user.isExisted(values.userName);
      if (!userExisted) {
        this.props.navigation.navigate(SCREENS[SCREENS.SIGN_UP_COMPANY], values);
      } else {
        Alert.alert('Error', 'Username existed');
      }
    } catch (err) {
      console.log(err.response.status, JSON.stringify(err, null, 2));

      Alert.alert('Log in failed', 'Unable to sign in, try again later');
    } finally {
      activityStatus.dismiss();
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
                  userName: 'aaaa@gmail.com',
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
export default SubscribeHOC([activityStatus])(SignUp);
