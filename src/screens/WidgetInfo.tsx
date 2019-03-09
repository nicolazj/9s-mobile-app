import React from 'react';
import { ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import WidgetComp from '../components/widget';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled from '../styled';
import { App, WidgetSample } from '../types';
import { ConnectedApp, ConnectedAppImg, ConnectedAppLabel } from './AppList';
import { transform } from './WidgetList';

const Desc = styled(P.Text)`
  color: #999;
  margin-bottom: 10px;
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
      <P.Container hasPadding style={{ backgroundColor: '#fff' }}>
        <WidgetComp sample={true} widget={transform(sample)} />

        <View>
          {sample.description.split('<br>').map(p => (
            <Desc key={p}>{p} </Desc>
          ))}
        </View>
        <View style={{ paddingBottom: 30 }}>
          <P.H3>Available using these Apps</P.H3>
          {sample.services.map(s => {
            const app = appState.getApp(s) as App;
            return (
              <ConnectedApp
                key={app.key}
                onPress={() => {
                  navigation.push(SCREENS[SCREENS.APP_DETAIL], app);
                }}
              >
                <ConnectedAppImg source={{ uri: app.squareLogo }} />
                <ConnectedAppLabel>
                  {app.shortName || app.name}
                </ConnectedAppLabel>
              </ConnectedApp>
            );
          })}
        </View>
      </P.Container>
    </ScrollView>
  );
};
export default SubscribeHOC([appState])(WidgetInfo);
