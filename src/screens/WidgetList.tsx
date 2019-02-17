import React from 'react';
import { Image, Linking, ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import Link from '../components/Link';
import WidgetComp from '../components/widget';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { scale } from '../scale';
import activityStatusState, { ActivityStatusState } from '../states/ActivityStatus';
import appState, { AppState } from '../states/Apps';
import authContainer, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';
import styled, { th } from '../styled';
import { App } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState, UserState, AuthState, ActivityStatusState];
}
function transform(sample: WidgetSample): Widget {
  const { extras, graph_data, data_sets, key, services, ...attrs } = sample;
  return {
    data: { extras, graphData: graph_data, dataSets: data_sets },
    key,
    attributes: { ...attrs, origin: services[0] },
  };
}
class WidgetList extends React.Component<Props> {
  render() {
    const [appState] = this.props.states;
    const groupedSamples = appState.getGroupedSample();
    return (
      <P.Container>
        <ScrollView>
          {Object.keys(groupedSamples).map(cat => {
            return (
              <View key={cat}>
                <P.Text>{cat}</P.Text>
                <ScrollView horizontal={true}>
                  <View style={{ flexDirection: 'row' }}>
                    {groupedSamples[cat].map(widget => {
                      return (
                        <View key={widget.displayName}>
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
  }
}

export default SubscribeHOC([appState, userState, authContainer, activityStatusState])(WidgetList);
