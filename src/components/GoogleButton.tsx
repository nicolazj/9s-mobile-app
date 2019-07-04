import Constants from 'expo-constants';
import * as Google from 'expo-google-sign-in';
import React from 'react';
import { Alert } from 'react-native';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

import agent from '../agent';
import { GOOGLE_CLIENT_ID } from '../agent/config';
import log from '../logging';
import { SCREENS } from '../routes/constants';
import * as GoogleService from '../services/googleLogin';
import { dismiss, show } from '../stores/activityStatus';
import { SocialButon } from './SocialButton';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

const isInClient = Constants.appOwnership === 'expo';
if (isInClient) {
  Google.allowInClient();
}

const GoogleButton: React.FC<Props> = props => {
  React.useEffect(() => {
    GoogleService.init()
  }, []);

  const googleLogin = async () => {
    try {
      const result = await GoogleService.signIn();

      log('google auth result:', result);

      if (result.type === 'success') {
        const { type, user } = result;
        show('Logging in');
        if (type === 'success' && user) {
          await agent.token.oauth(user.auth!.accessToken!);
          props.navigation.navigate(SCREENS[SCREENS.LOADING]);
        } else throw new Error('no user');
      }
    } catch (err) {
      log('google login error', err);
      Alert.alert('try again later');
    } finally {
      dismiss();
    }
  };

  return (
    <SocialButon
      title="Log in with Google"
      icon={require('../../assets/google.png')}
      onPress={googleLogin}
      {...props}
    />
  );
};
export default withNavigation(GoogleButton);
