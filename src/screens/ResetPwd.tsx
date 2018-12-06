import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, Image, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import agent from '../agent';
import Button from '../components/Button';
import Link from '../components/Link';
import { FormDesc, FormikTextInput, FormTitle } from '../formik';
import { Container, SafeArea, Text } from '../primitives';
import { SCREENS } from '../routes/constants';
import { object, username } from '../validations';
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class ResetPwd extends React.Component<Props> {
  public state = {
    done: false,
  };
  public onPress = async (values: { email: string }) => {
    try {
      await agent.public.password.reset(values.email);
      this.setState({ done: true });
    } catch (err) {
      Alert.alert('Reset password failed', 'try again later');
    }
  };

  public render() {
    const { done } = this.state;
    return (
      <Container>
        <SafeArea>
          {done ? (
            <Container padding hcenter vcenter>
              <Image style={{ width: 150, height: 150 }} source={{ uri: 'https://via.placeholder.com/150' }} />
              <FormTitle>Email sent!</FormTitle>
              <Text>Check your inbox for a link to </Text>
              <Text> reset your password</Text>
              <Link
                title="Done"
                onPress={() => {
                  this.props.navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
                }}
                style={{ margin: 20 }}
              />
            </Container>
          ) : (
            <Container padding>
              <Formik
                initialValues={{
                  email: '',
                }}
                validationSchema={object().shape({
                  email: username,
                })}
                onSubmit={this.onPress}>
                {({ handleSubmit }) => (
                  <View>
                    <FormTitle style={{ marginBottom: 30 }}>Reset your password</FormTitle>
                    <FormDesc>
                      No problem! Enter your email address and we will send you a link to reset your password
                    </FormDesc>
                    <Field name="email" component={FormikTextInput} placeholder="Email" />
                    <Button title="Reset password" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
            </Container>
          )}
        </SafeArea>
      </Container>
    );
  }
  public async componentDidMount() {
    await agent.token.public();
  }
}
