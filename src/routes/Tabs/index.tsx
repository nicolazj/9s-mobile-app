import { createBottomTabNavigator } from 'react-navigation';

import DashboardStack from './Dashboard';
import MarketplaceStack from './Marketplace';

import SettingsStack from './Settings';

export default createBottomTabNavigator({
  DashboardStack,
  MarketplaceStack,
  SettingsStack,
});
