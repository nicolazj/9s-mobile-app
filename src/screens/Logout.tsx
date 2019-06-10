import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { SCREENS } from '../routes/constants';
import { useAuthStore } from '../stores/auth';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

const Logout: React.FC<Props> = ({ navigation }) => {
  const authStoreActions = useAuthStore(store => store.actions);
  React.useEffect(() => {
    bootstrapAsync();
  }, []);
  const bootstrapAsync = async () => {
    authStoreActions.clear();
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
