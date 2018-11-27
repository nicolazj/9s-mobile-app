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
import { SignUpPayload } from '../../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class SignUp extends React.Component<Props> {
  public componentDidMount() {
    agent.token.public();
  }
  public onPress = async (values: SignUpPayload) => {
    try {
      console.log(values);
      // await agent.public.user.create(values);
      // await agent.token.login({ username: values.userName, password: values.password });
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
                  companyName: 'nicolazj121233@gmail.com',
                  industryUuid: '',
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
