import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

import agent from '../agent';
import SuggestAppLink from '../components/SuggestAppLink';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { dismiss, show } from '../stores/activityStatus';
import { OSPStoreAPI, useAvailableApps } from '../stores/osp';
import styled, { scale } from '../styled';
import { App } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

const Title = styled(P.H1)`
  text-align: center;
`;
const SubTitle = styled(P.H3)`
  text-align: center;
  color: #999;
`;

const AvaibleAppContainer = styled(P.Container)`
  background-color: #fff;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const AvaibleApp = styled(P.Touchable)<{ children: React.ReactNode }>`
  width: 33%;
  align-items: center;
`;
const AvaibleAppTextView = styled(View)`
  flex: 1;
  margin: ${scale(4)}px;
`;
const AvaibleAppLabel = styled(P.Text)`
  font-size: ${scale(12)}px;
  text-align: center;
  color: #aaa;
`;

const AvaibleAppImg = styled(Image)`
  margin: ${scale(10)}px;
  height: ${scale(40)}px;
  width: ${scale(40)}px;
`;

const ForceConnect: React.FC<Props> = ({ navigation }) => {

  const availableApps = useAvailableApps();

  React.useEffect(() => {
    fetchApps();
  }, []);
  const fetchApps = async () => {
    show('Loading');

    const [connections, spokes, apps] = await Promise.all([
      agent.company.connection.list(),
      agent.user.spoke.get('mobile'),
      agent.user.service.list(),
    ]);
    const fullApps = await Promise.all(
      apps.map(app => agent.user.service.get(app.key))
    );
    OSPStoreAPI.setState({ connections, spokes, apps: fullApps });
    dismiss();
  };

  const onPress = (app: App) => {
    navigation.navigate(SCREENS[SCREENS.APP_DETAIL], app);
  };

  return (
    <P.Container hasPadding style={{ backgroundColor: '#fff' }}>
      <ScrollView>
        <Title style={{ textAlign: 'center' }}>Connect your apps</Title>
        <SubTitle style={{ textAlign: 'center', color: '#999' }}>
          Choose from our supported apps to connect to your dashboard
        </SubTitle>
        <AvaibleAppContainer>
          {availableApps.map((app: App) => (
            <AvaibleApp key={app.key} onPress={() => onPress(app)}>
              <AvaibleAppImg source={{ uri: app.squareLogo }} />
              <AvaibleAppTextView>
                <AvaibleAppLabel>{app.name}</AvaibleAppLabel>
              </AvaibleAppTextView>
            </AvaibleApp>
          ))}
        </AvaibleAppContainer>
        <SuggestAppLink />
      </ScrollView>
    </P.Container>
  );
};

export default withNavigation(ForceConnect);
