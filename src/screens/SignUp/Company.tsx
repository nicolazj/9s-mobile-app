import { Constants } from 'expo';
import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenProp } from 'react-navigation';
import * as Yup from 'yup';
import agent from '../../agent';
import { FormikPicker, FormikTextInput } from '../../primitives';
import { Button, Container, FormTitle, SafeArea } from '../../primitives';
import { SCREENS } from '../../routes/constants';
import { SignUpPayload } from '../../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class SignUp extends React.Component<Props> {
  public componentDidMount() {
    agent.token.public();
  }
  public onPress = async values => {
    const signUpPayload = this.props.navigation.state.params as SignUpPayload;
    try {
      const user = await agent.public.user.create(signUpPayload);
      console.log(user);
      await agent.token.login({ username: signUpPayload.userName, password: signUpPayload.password });
      const company = await agent.user.company.create(values);
      console.log(company);
      await agent.token.exchange(company.companyUuid);
      this.props.navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
    } catch (err) {
      console.log(err.response.status, JSON.stringify(err, null, 2));

      Alert.alert('Log in failed', 'Unable to sign in, try again later');
    }
  };

  public render() {
    return (
      <Container>
        <SafeArea>
          <KeyboardAwareScrollView extraHeight={Constants.statusBarHeight}>
            <Container padding={true}>
              <Formik
                initialValues={{
                  companyName: '123',
                  industryUuid: 'ee155ff4-a2dc-4e54-8ae1-a0c138a6a49b',
                }}
                validationSchema={Yup.object().shape({
                  companyName: Yup.string().required('Required'),
                  industryUuid: Yup.string().required('Required'),
                })}
                onSubmit={this.onPress}>
                {({ handleSubmit }) => (
                  <View style={{ flex: 1 }}>
                    <FormTitle style={{ marginBottom: 20 }}>Company Profile</FormTitle>
                    <Field name="companyName" component={FormikTextInput} placeholder="Company name" />
                    <Field
                      name="industryUuid"
                      component={FormikPicker}
                      placeholder="Select an industry"
                      options={[{ label: 'l1', value: 'v1' }, { label: 'l2', value: 'v2' }]}
                    />

                    <Button title="Proceed" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
            </Container>
          </KeyboardAwareScrollView>
        </SafeArea>
      </Container>
    );
  }
}
