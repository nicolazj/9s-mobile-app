import { Google } from 'expo';
import React from 'react';
import { Alert } from 'react-native';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

import agent from '../agent';
import { GOOGLE_CLIENT_ID } from '../agent/config';
import log from '../logging';
import { SCREENS } from '../routes/constants';
import activityStatusState, {
    ActivityStatusState
} from '../states/ActivityStatus';
import { SubscribeHOC } from '../states/helper';
import { SocialButon } from './SocialButton';

interface Props {
  states: [ActivityStatusState];
  navigation: NavigationScreenProp<any, any>;
}

log('GOOGLE_CLIENT_ID', GOOGLE_CLIENT_ID);
const GoogleButton: React.FC<Props> = props => {
  const googleLogin = async () => {
    try {
      const result = await Google.logInAsync({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'email', 'profile'],
        behavior: 'web',
      });

      log('google auth result:', result);

      if (result.type === 'success') {
        const { accessToken } = result;
        const [activityStatusState] = props.states;
        activityStatusState.show('Logging in');
        await agent.token.oauth(accessToken);
        props.navigation.navigate(SCREENS[SCREENS.LOADING]);
      }
    } catch (err) {
      log('google login error', err);
      Alert.alert('try again later');
    } finally {
      activityStatusState.dismiss();
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
export default SubscribeHOC([activityStatusState])(
  withNavigation(GoogleButton)
);
