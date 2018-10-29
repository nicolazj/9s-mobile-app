import { createStackNavigator } from 'react-navigation';
import { th, IThemeInterface } from '../../styled';

import WidgetScreen from '../../screens/Widget';
import WidgetDetail from '../../screens/WidgetDetail';
import { getTabNavOpts } from './helper';

const MarketplaceStack = createStackNavigator(
  {
    Widget: WidgetScreen,
    WidgetDetail: WidgetDetail,
  },
  {
    navigationOptions: props => {
      return {
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: th('color.header')(props.screenProps as { theme: IThemeInterface }),
        },
      };
    },
  }
);

MarketplaceStack.navigationOptions = getTabNavOpts({ title: 'Marketplace', icon: 'apps' });

export default MarketplaceStack;
