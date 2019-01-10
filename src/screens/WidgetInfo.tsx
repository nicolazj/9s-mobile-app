import React from 'react';
import { View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import Widget from '../components/widget';
import { getWidgetSampleByKey } from '../components/widget/utils';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

const WidgetInfo: React.StatelessComponent<Props> = ({ navigation }) => {
  const key = navigation.getParam('key');
  const sample = getWidgetSampleByKey(key);
  console.log(sample, 'sample');
  return (
    <View>
      <Widget sample={true} widget={sample} />
    </View>
  );
};
export default WidgetInfo;
