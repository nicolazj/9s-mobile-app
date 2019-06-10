import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { SCREENS } from '../routes/constants';
import authState, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AuthState, ];
}

const Logout: React.FC<Props> = ({ states, navigation }) => {
  const [authState_, ] = states;

  React.useEffect(() => {
    bootstrapAsync();
  }, []);
  const bootstrapAsync = async () => {
    authState_.clear();
    AsyncStorage.clear();
    navigation.navigate(SCREENS[SCREENS.SIGN_IN]);
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  );
};

export default SubscribeHOC([authState, ])(Logout);
