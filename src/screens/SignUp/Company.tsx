import { Constants, WebBrowser } from 'expo';
import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenProp } from 'react-navigation';
import { Container as UnContainer } from 'unstated';
import * as Yup from 'yup';
import agent from '../../agent';
import Button from '../../components/Button';
import Link from '../../components/Link';
import { FormDesc, FormikPicker, FormikTextInput, FormTitle } from '../../formik';
import * as P from '../../primitives';
import { SCREENS } from '../../routes/constants';
import activityStatusState, { ActivityStatusState } from '../../states/ActivityStatus';
import { SubscribeHOC } from '../../states/helper';
import userState, { UserState } from '../../states/User';
import { SignUpPayload } from '../../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [ActivityStatusState, UserState];
}

interface Industry {
  displayName: string;
  industryUUID: string;
}

interface State {
  industries: Industry[];
}

export class SignUpCompany extends React.Component<Props, State> {
  state = {
    industries: [],
  };
  async componentDidMount() {
    const industries = await agent.public.industry.get();
    this.setState({
      industries,
    });
  }
  onPress = async (values: object) => {
    const [activityStatusState, userState] = this.props.states;

    const signUpPayload = this.props.navigation.state.params as SignUpPayload;
    try {
      activityStatusState.show('Creating account');
      await agent.public.user.create(signUpPayload);

      activityStatusState.show('Logging in');
      await agent.token.login({ username: signUpPayload.userName, password: signUpPayload.password });
      const me = await agent.user.user.me();
      userState.setState({ me });

      activityStatusState.show('Creating Company');
      const company = await agent.user.company.create(values);
      const companies = await agent.user.company.list();
      userState.setState({
        companies,
      });

      activityStatusState.show('Switching  company');

      await agent.token.exchange(company.companyUuid);
      this.props.navigation.navigate(SCREENS[SCREENS.LOADING]);
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert('Log in failed', 'Unable to sign in, try again later');
    } finally {
      activityStatusState.dismiss();
    }
  };

  render() {
    const options = this.state.industries.map(({ displayName, industryUUID }: Industry) => ({
      value: industryUUID,
      label: displayName,
    }));
    return (
      <P.Container>
        <P.SafeArea>
          <KeyboardAwareScrollView extraHeight={Constants.statusBarHeight}>
            <P.Container padding={true}>
              <Formik
                initialValues={{
                  companyName: '',
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
                      options={options}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginBottom: 15,
                        flexWrap: 'wrap',
                      }}>
                      <FormDesc> By tapping proceed, you are accepting the </FormDesc>
                      <Link
                        title="Terms & Conditions"
                        onPress={() => {
                          WebBrowser.openBrowserAsync('https://www.9spokes.com/legal/terms-and-conditions/');
                        }}
                      />
                      <FormDesc> related to 9Spokes Dashboard.</FormDesc>
                    </View>
                    <Button title="Proceed" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
            </P.Container>
          </KeyboardAwareScrollView>
        </P.SafeArea>
      </P.Container>
    );
  }
}

export default SubscribeHOC([activityStatusState, userState])(SignUpCompany);
