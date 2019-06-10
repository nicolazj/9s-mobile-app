import React from 'react';
import {
    ActivityIndicator, Alert, AsyncStorage, StatusBar, View
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import log from '../logging';
import { SCREENS } from '../routes/constants';
import authState, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import { useAppStore } from '../stores/app';
import { useUserStore } from '../stores/user';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AuthState];
}

const AuthLoadingScreen: React.FC<Props> = ({ states, navigation }) => {
  const userActions = useUserStore(store => store.actions);
  const { onboarded } = useAppStore(({ onboarded }) => ({ onboarded }));
  React.useEffect(() => {
    bootstrapAsync();
  }, []);

  let [authState_] = states;

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
    const hasUserId = authState_.hasUserId();

    if (!hasUserId) {
      return false;
    }
    try {
      const [me, companies] = await Promise.all([
        agent.user.user.me(),
        agent.user.company.list(),
      ]);
      userActions.set({ me, companies });
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

export default SubscribeHOC([authState])(AuthLoadingScreen);
