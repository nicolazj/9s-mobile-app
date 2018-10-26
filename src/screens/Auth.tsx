import React from 'react';
import { View, Dimensions } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import styled from '../styled';
import { VCenter, SafeArea, KeyboardAvoiding, FormTitle, Content, Button, Text, Link } from '../primitives';
import GoogleButton from '../primitives/GoogleButton';
import { TextInput } from '../primitives/form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import agent from '../agent';
import auth from '../states/Auth';
import { LoginPayload } from '../types';
import { Constants } from 'expo';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

const Delimiter = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const DelimiterText = styled(Text)`
  padding: 20px 30px;
`;
const DelimiterBar = styled(View)`
  height: 0;
  border: 1px solid #ccc;
  border-radius: 1;
  flex: 1;
`;
export default class Auth extends React.Component<Props> {
  onPress = async (values: LoginPayload) => {
    console.log(values);
    try {
      const user = await agent.basic.login(values);

      await auth.setUser(user);
      const companies = await agent.user.company.list();
      if (companies.length === 1) {
        await agent.user.exchange(companies[0].companyUuid);
      }
      await this.props.navigation.navigate('Main');
    } catch (err) {}
  };

  render() {
    return (
      <SafeArea>
        <KeyboardAwareScrollView extraHeight={Constants.statusBarHeight}>
          <Content>
            <Formik
              initialValues={{
                username: 'nicolas.jiang@9spokes.com',
                password: '',
              }}
              validationSchema={Yup.object().shape({
                username: Yup.string().required('Required'),
                password: Yup.string().required('Required'),
              })}
              onSubmit={this.onPress}>
              {({ handleSubmit }) => (
                <View style={{ flex: 1 }}>
                  <FormTitle style={{ marginBottom: 150 }}>Login</FormTitle>
                  <Field name="username" component={TextInput} placeholder="Email" />

                  <Field name="password" component={TextInput} placeholder="Password" />
                  <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                    <Text>Can't Log In? </Text>
                    <Link title="Reset Password" />
                  </View>

                  <Button title="Sign in" onPress={handleSubmit} />
                </View>
              )}
            </Formik>
            <Delimiter style={{ flexDirection: 'row' }}>
              <DelimiterBar />
              <DelimiterText>or</DelimiterText>
              <DelimiterBar />
            </Delimiter>
            <GoogleButton
              onPress={() => {
                console.log(123);
              }}
            />
          </Content>
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
          <Link title="Signup" />
        </View>
      </SafeArea>
    );
  }
}
