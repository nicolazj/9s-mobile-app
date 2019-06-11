import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { SCREENS } from '../routes/constants';
import { clear } from '../stores/auth';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

const Logout: React.FC<Props> = ({ navigation }) => {
  React.useEffect(() => {
    bootstrapAsync();
  }, []);
  const bootstrapAsync = async () => {
    clear();
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

export default Logout;
