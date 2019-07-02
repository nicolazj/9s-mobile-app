import { Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

export const createStack =
  Platform.OS === 'web' ? createSwitchNavigator : createStackNavigator;
