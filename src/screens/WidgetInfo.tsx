import React from 'react';
import { View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import Widget from '../components/widget';
import { getWidgetSampleByKey } from '../components/widget/utils';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState];
}

const WidgetInfo: React.FC<Props> = ({ navigation, states }) => {
  const key = navigation.getParam('key');
  const sample = getWidgetSampleByKey(key);
  console.log(sample, 'sample');
  return (
    <View>
      <Widget sample={true} widget={sample} />
    </View>
  );
};
export default SubscribeHOC([appState])(WidgetInfo);
