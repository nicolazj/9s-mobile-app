import React from 'react';
import { ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import WidgetComp from '../components/widget';
import log from '../logging';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { getApp, getSample } from '../stores/osp';
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
}

const WidgetInfo: React.FC<Props> = ({ navigation }) => {

  const key = navigation.getParam('key');
  const sample = getSample(key) as WidgetSample;

  log(sample);
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
          <ScrollView horizontal={true} style={{ backgroundColor: '#fff' }}>
            {sample.services.map(s => {
              const app = getApp(s) as App;
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
          </ScrollView>
        </View>
      </P.Container>
    </ScrollView>
  );
};
export default WidgetInfo;
