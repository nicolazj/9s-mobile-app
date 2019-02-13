import React from 'react';
import { View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import Widget from '../components/widget';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState];
}

const WidgetInfo: React.FC<Props> = ({ navigation, states }) => {
  const key = navigation.getParam('key');
  const [appState] = states;
  const sample = appState.getSample(key);

  return (
    <View>
      <Widget sample={true} widget={sample} />
    </View>
  );
};
export default SubscribeHOC([appState])(WidgetInfo);
