import React from 'react';
import {
    ActivityIndicator, Alert, AsyncStorage, StatusBar, View
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import log from '../logging';
import { SCREENS } from '../routes/constants';
import { useAppStore } from '../stores/app';
import { hasUserId } from '../stores/auth';
import { userStoreAPI } from '../stores/user';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

const AuthLoadingScreen: React.FC<Props> = ({ navigation }) => {
  const { onboarded } = useAppStore(({ onboarded }) => ({ onboarded }));
  React.useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const loggedIn = await checkingLogin();

      if (loggedIn) {
        navigation.navigate(SCREENS[SCREENS.SWITCH_COMPANY], {
          auto: true,
        });
      } else if (!onboarded) {
        navigation.navigate(SCREENS[SCREENS.ONBOARDING]);
      } else navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
    } catch (err) {
      log('loading error', err);
      Alert.alert('please try again later');
      AsyncStorage.clear();
    }
  };

  const checkingLogin = async () => {
    if (!hasUserId()) {
      return false;
    }
    try {
      const [me, companies] = await Promise.all([
        agent.user.user.me(),
        agent.user.company.list(),
      ]);
      userStoreAPI.setState({ me, companies });
      return true;
    } catch (err) {
      log(JSON.stringify(err, null, 2));
      return false;
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  );
};

export default AuthLoadingScreen;
