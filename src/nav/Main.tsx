import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/Home';
import WidgetScreen from '../screens/Widget';
import WidgetDetail from '../screens/WidgetDetail';
import SettingsScreen from '../screens/Settings';

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen, navigationOptions: { title: '123' } },
});
HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-information-circle'}
    />
  ),
};

const WidgetStack = createStackNavigator({
  Widget: WidgetScreen,
  WidgetDetail: WidgetDetail,
});

WidgetStack.navigationOptions = {
  tabBarLabel: 'Widgets',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'} />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  WidgetStack,
  SettingsStack,
});
