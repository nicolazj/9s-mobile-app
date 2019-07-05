import React from 'react';
import { Alert, Image, ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Ionicons } from '@expo/vector-icons';

import agent from '../agent';
import SuggestAppLink from '../components/SuggestAppLink';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { dismiss, show } from '../stores/activityStatus';
import { OSPStoreAPI, useAvailableApps, usePurchasedApps } from '../stores/osp';
import styled, { scale, th } from '../styled';
import { App } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
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

const AvaibleAppTextView = styled(View)`
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

const AppList: React.FC<Props> = ({ navigation }) => {
  const purchasedApps = usePurchasedApps();
  const availableApps = useAvailableApps();

  React.useEffect(() => {
    const fetchApps = async () => {
      show('Loading');
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
        OSPStoreAPI.setState({ connections, spokes, apps: fullApps, samples });
      } catch (err) {
        Alert.alert('please try again later');
      } finally {
        dismiss();
      }
    };

    fetchApps();
  }, []);

  const onPress = (app: App) => {
    navigation.push(SCREENS[SCREENS.APP_DETAIL], app);
  };

  return (
    <P.Container>
      <ScrollView>
        <View>
          {purchasedApps.length > 0 && [
            <P.Container key="connected-app-title" hasPadding noFlex>
              <Title>My Connected Apps</Title>
            </P.Container>,
            <ScrollView
              key="connected-app-view"
              horizontal={true}
              style={{ backgroundColor: '#fff' }}
            >
              {purchasedApps.map((app: App) => (
                <ConnectedApp key={app.key} onPress={() => onPress(app)}>
                  <ConnectedAppImg source={{ uri: app.squareLogo }} />
                  <ConnectedAppLabel>
                    {app.shortName || app.name}
                  </ConnectedAppLabel>
                </ConnectedApp>
              ))}
            </ScrollView>,
          ]}
        </View>
        <View>
          <P.Container hasPadding noFlex>
            <Title>Available Apps</Title>
          </P.Container>
          <P.List>
            {availableApps.map((app: App) => (
              <P.ListItem key={app.key} onPress={() => onPress(app)}>
                <P.Left>
                  <AvaibleAppImg source={{ uri: app.squareLogo }} />
                </P.Left>
                <P.Body>
                  <AvaibleAppTextView>
                    <AvaibleAppLabel>{app.name}</AvaibleAppLabel>
                    <AvaibleAppSum>{app.summary}</AvaibleAppSum>
                  </AvaibleAppTextView>
                </P.Body>
                <P.Right>
                  <Ionicons name="ios-arrow-forward" />
                </P.Right>
              </P.ListItem>
            ))}
          </P.List>
        </View>
        <SuggestAppLink />
      </ScrollView>
    </P.Container>
  );
};

export default AppList;
