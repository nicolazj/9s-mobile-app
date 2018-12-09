import React from 'react';
import { Platform } from 'react-native';
import { NavigationBottomTabScreenOptions, NavigationScreenConfig } from 'react-navigation';
import { Icon, Label } from '../../components/TabBar';

export function getTabNavOpts({
  title,
  icon,
}: {
  title: string;
  icon: string;
}): NavigationScreenConfig<NavigationBottomTabScreenOptions> {
  return {
    tabBarLabel: ({ focused }) => {
      return <Label focused={focused}>{title}</Label>;
    },
    tabBarIcon: ({ focused }) => {
      return <Icon focused={focused} name={Platform.OS === 'ios' ? `ios-${icon}` : `md-${icon}`} />;
    },
  };
}
