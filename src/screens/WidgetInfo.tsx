import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import WidgetComp from '../components/widget';
import * as P from '../primitives';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled from '../styled';
import { App, WidgetSample } from '../types';
import { transform } from './WidgetList';

const Desc = styled(P.Text)`
  color: #999;
  margin-bottom: 10px;
`;
const AppIcon = styled(Image)`
  margin-left: 4px;
  width: 48px;
  height: 48px;
`;
interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState];
}

const WidgetInfo: React.FC<Props> = ({ navigation, states }) => {
  const key = navigation.getParam('key');
  const [appState] = states;
  const sample = appState.getSample(key) as WidgetSample;

  return (
    <ScrollView>
      <P.Container padding>
        <WidgetComp sample={true} widget={transform(sample)} />

        <View>
          {sample.description.split('<br>').map(p => (
            <Desc key={p}>{p} </Desc>
          ))}
        </View>
        <View>
          <P.H2>Apps</P.H2>
          {sample.services.map(s => {
            const app = appState.getApp(s) as App;
            return <AppIcon key={app.key} source={{ uri: app.squareLogo }} />;
          })}
        </View>
      </P.Container>
    </ScrollView>
  );
};
export default SubscribeHOC([appState])(WidgetInfo);
