import { WebBrowser } from 'expo';
import Constants from 'expo-constants';
import { Field, Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import {
    KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenProp } from 'react-navigation';
import * as Yup from 'yup';

import agent from '../../agent';
import Button from '../../components/Button';
import Link from '../../components/Link';
import {
    FormDesc, FormikPicker, FormikTextInput, FormTitle
} from '../../formik';
import log from '../../logging';
import * as P from '../../primitives';
import { SCREENS } from '../../routes/constants';
import { alert } from '../../services/Alert';
import { dismiss, show } from '../../stores/activityStatus';
import { userStoreAPI } from '../../stores/user';
import { Industry, SignUpPayload } from '../../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

const SignUpCompany: React.FC<Props> = ({ navigation }) => {
  const [industries, setIndustries] = React.useState<Industry[]>([]);

  React.useEffect(() => {
    let isCurrent = true;

    const getIndustries = async () => {
      const ind = await agent.public.industry.get();
      isCurrent &&
        setIndustries(
          ind.sort((a, b) => {
            if (a.displayName < b.displayName) {
              return -1;
            }
            if (a.displayName > b.displayName) {
              return 1;
            }
            return 0;
          })
        );
    };
    getIndustries();
    return () => {
      isCurrent = false;
    };
  }, []);

  const onSubmit = async (values: object) => {
    const signUpPayload = navigation.state.params as SignUpPayload;
    try {
      show('Creating account');
      await agent.public.user.create(signUpPayload);

      show('Logging in');
      await agent.token.login({
        username: signUpPayload.userName,
        password: signUpPayload.password,
      });
      const me = await agent.user.user.me();
      userStoreAPI.setState({ me });

      show('Creating Company');
      const company = await agent.user.company.create(values);
      log('create company:', company);
      navigation.navigate(SCREENS[SCREENS.LOADING]);
    } catch (err) {
      log(JSON.stringify(err, null, 2));
      alert('Log in failed', 'Unable to sign in, try again later');
    } finally {
      dismiss();
    }
  };

  const options = industries.map(({ displayName, industryUUID }: Industry) => ({
    value: industryUUID,
    label: displayName,
  }));
  return (
    <P.Container>
      <P.SafeArea>
        <KeyboardAwareScrollView extraHeight={Constants.statusBarHeight}>
          <P.Container hasPadding>
            <Formik
              initialValues={{
                companyName: '',
                industryUuid: '',
              }}
              validationSchema={Yup.object().shape({
                companyName: Yup.string().required('Required'),
                industryUuid: Yup.string().required('Required'),
              })}
              onSubmit={onSubmit}
            >
              {({ handleSubmit }) => (
                <View style={{ flex: 1 }}>
                  <FormTitle style={{ marginBottom: 20 }}>
                    Company Profile
                  </FormTitle>
                  <Field
                    name="companyName"
                    component={FormikTextInput}
                    placeholder="Company name"
                  />
                  <Field
                    name="industryUuid"
                    component={FormikPicker}
                    placeholder="Select an industry"
                    title="Select an industry"
                    subTitle="Choose one of our available industries that best reflects your business"
                    options={options}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginBottom: 15,
                      flexWrap: 'wrap',
                    }}
                  >
                    <FormDesc>
                      By tapping proceed, you are accepting the{' '}
                    </FormDesc>
                    <Link
                      title="Terms & Conditions"
                      onPress={() => {
                        WebBrowser.openBrowserAsync(
                          'https://www.9spokes.com/legal/terms-and-conditions/'
                        );
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
};

export default SignUpCompany;
