import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import WidgetComp from '../components/widget';
import * as P from '../primitives';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import { Widget, WidgetSample } from '../types';

const { width } = Dimensions.get('window');

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState];
}
export function transform(sample: WidgetSample): Widget {
  const { extras, graph_data, data_sets, key, services, ...attrs } = sample;
  return {
    data: { extras, graphData: graph_data, dataSets: data_sets },
    key,
    attributes: { ...attrs, origin: services[0] },
  };
}
const WidgetList :React.FC<Props>  = ({states}) => {
  const [appState_] =states;
  const groupedSamples = appState_.getGroupedSample();
  return (
    <P.Container>
      <ScrollView>
        {Object.keys(groupedSamples).map(cat => {
          return (
            <View key={cat}>
              <P.Container hasPadding>
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

export default SubscribeHOC([appState])(WidgetList);
