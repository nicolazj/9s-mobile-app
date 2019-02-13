import React from 'react';
import { Image, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import WidgetComp from '../components/widget';
import * as P from '../primitives';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled from '../styled';
import { App, Widget, WidgetSample } from '../types';

const Desc = styled(P.Text)`
  color: #333;
`;
const AppIcon = styled(Image)`
  margin-left: 4px;
  width: 64px;
  height: 64px;
`;
interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState];
}

function transform(sample: WidgetSample): Widget {
  const { extras, graph_data, key, services, ...attrs } = sample;
  return { data: { extras, graphData: graph_data }, key, attributes: { ...attrs, origin: services[0] } };
}

const WidgetInfo: React.FC<Props> = ({ navigation, states }) => {
  const key = navigation.getParam('key');
  const [appState] = states;
  const sample = appState.getSample(key) as WidgetSample;

  console.log(sample);
  return (
    <P.Container padding>
      <WidgetComp sample={true} widget={transform(sample)} />

      <View>
        {sample.description.split('<br>').map(p => (
          <Desc key={p}>{p} </Desc>
        ))}
      </View>
      <View>
        {sample.services.map(s => {
          const app = appState.getApp(s) as App;
          return <AppIcon key={app.key} source={{ uri: app.squareLogo }} />;
        })}
      </View>
    </P.Container>
  );
};
export default SubscribeHOC([appState])(WidgetInfo);
