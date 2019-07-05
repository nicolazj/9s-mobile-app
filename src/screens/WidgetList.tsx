import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import WidgetComp from '../components/widget';
import * as P from '../primitives';
import { getGroupedSample } from '../stores/osp';
import { Widget, WidgetSample } from '../types';

const { width } = Dimensions.get('window');

interface Props {
  navigation: NavigationScreenProp<any, any>;
}
export function transform(sample: WidgetSample): Widget {
  const { extras, graph_data, data_sets, key, services, ...attrs } = sample;
  return {
    data: { extras, graphData: graph_data, dataSets: data_sets },
    key,
    attributes: { ...attrs, origin: services[0] },
  };
}
const WidgetList: React.FC<Props> = ({}) => {

  const groupedSamples = getGroupedSample();

  console.log('groupedSamples',groupedSamples)
  return (
    <P.Container>
      <ScrollView>
        {Object.keys(groupedSamples).map(cat => {
          return (
            <View key={cat}>
              <P.Container hasPadding noFlex>
                <P.H2>{cat}</P.H2>
              </P.Container>
              <ScrollView horizontal={true}>
                <View style={{ flexDirection: 'row' }}>
                  {groupedSamples[cat].map(widget => {
                    return (
                      <View
                        key={widget.displayName}
                        style={{ width, padding: 20 }}
                      >
                        <WidgetComp sample={true} widget={transform(widget)} />
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </P.Container>
  );
};

export default WidgetList;
