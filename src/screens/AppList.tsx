import React from 'react';
import { Alert, Image, ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import SuggestAppLink from '../components/SuggestAppLink';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import { useActivityStatusStore } from '../stores/activityStatus';
import styled, { scale, th } from '../styled';
import { App } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState];
}

const Title = styled(P.H1)`
  margin: ${scale(20)}px;
  margin-left: 0;
`;

export const ConnectedApp = styled(P.Touchable)<{
  children: React.ReactNode;
}>`
  flex: 1;
  width: 100px;
  align-items: center;
  margin: ${scale(10)}px;
`;
export const ConnectedAppImg = styled(Image)`
  margin: ${scale(10)}px;
  height: ${scale(40)}px;
  width: ${scale(40)}px;
`;
export const ConnectedAppLabel = styled(P.Text)`
  font-size: ${scale(12)}px;
  color: ${th('color.grey')};
  flex-wrap: wrap;
  text-align: center;
`;
const AvaibleAppContainer = styled(P.Container)`
  background-color: #fff;
  border-top-color: #eee;
  border-bottom-color: #eee;
  border-top-width: 1px;
  border-bottom-width: 1px;
`;
const AvaibleApp = styled(P.Touchable)<{
  children: React.ReactNode;
}>`
  flex-direction: row;
  flex: 1;
  border-bottom-color: #eee;
  border-bottom-width: 1px;
`;
const AvaibleAppTextView = styled(View)`
  flex: 1;
  margin: ${scale(10)}px;
  margin-left: 0;
`;
const AvaibleAppLabel = styled(P.Text)`
  font-size: ${scale(12)}px;
`;
const AvaibleAppSum = styled(P.Text).attrs(() => ({ numberOfLines: 3 }))`
  font-size: ${scale(11)}px;
  color: ${th('color.grey')};
`;

const AvaibleAppImg = styled(Image)`
  margin: ${scale(10)}px;
  height: ${scale(40)}px;
  width: ${scale(40)}px;
`;
const AvaibleAppOp = styled(View)`
  justify-content: center;
  padding: 4px;
`;
const AvaibleAppOpText = styled(P.Text)`
  color: ${th('color.grey')};
  font-size: ${scale(24)}px;
`;

const AppList: React.FC<Props> = ({ states, navigation }) => {
  const activityStatusActions = useActivityStatusStore(store => store.actions);
  const [appState_] = states;

  React.useEffect(() => {
    fetchApps();
  }, []);
  const fetchApps = async () => {
    activityStatusActions.show('Loading');
    try {
      const [connections, spokes, apps, samples] = await Promise.all([
        agent.company.connection.list(),
        agent.user.spoke.get('mobile'),
        agent.user.service.list(),
        agent.misc.widget.sample(),
      ]);
      const fullApps = await Promise.all(
        apps.map(app => agent.user.service.get(app.key))
      );
      appState_.setState({ connections, spokes, apps: fullApps, samples });
    } catch (err) {
      Alert.alert('please try again later');
    } finally {
      activityStatusActions.dismiss();
    }
  };

  const onPress = (app: App) => {
    navigation.push(SCREENS[SCREENS.APP_DETAIL], app);
  };

  return (
    <P.Container>
      <ScrollView>
        {appState_.purchasedApps.length > 0 && [
          <P.Container key="connected-app-title" hasPadding>
            <View>
              <Title>My Connected Apps</Title>
            </View>
          </P.Container>,
          <ScrollView
            key="connected-app-view"
            horizontal={true}
            style={{ backgroundColor: '#fff' }}
          >
            {appState_.purchasedApps.map((app: App) => (
              <ConnectedApp key={app.key} onPress={() => onPress(app)}>
                <ConnectedAppImg source={{ uri: app.squareLogo }} />
                <ConnectedAppLabel>
                  {app.shortName || app.name}
                </ConnectedAppLabel>
              </ConnectedApp>
            ))}
          </ScrollView>,
        ]}

        <P.Container hasPadding>
          <View>
            <Title>Available Apps</Title>
          </View>
        </P.Container>
        <AvaibleAppContainer>
          {appState_.availableApps.map((app: App) => (
            <AvaibleApp key={app.key} onPress={() => onPress(app)}>
              <AvaibleAppImg source={{ uri: app.squareLogo }} />
              <AvaibleAppTextView>
                <AvaibleAppLabel>{app.name}</AvaibleAppLabel>
                <AvaibleAppSum>{app.summary}</AvaibleAppSum>
              </AvaibleAppTextView>
              <AvaibleAppOp>
                <AvaibleAppOpText> › </AvaibleAppOpText>
              </AvaibleAppOp>
            </AvaibleApp>
          ))}
        </AvaibleAppContainer>

        <SuggestAppLink />
      </ScrollView>
    </P.Container>
  );
};

export default SubscribeHOC([appState])(AppList);
