import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

import agent from '../agent';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { scale } from '../scale';
import activityStatusState, {
  ActivityStatusState,
} from '../states/ActivityStatus';
import appState, { AppState } from '../states/Apps';
import authContainer, { AuthState } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import userState, { UserState } from '../states/User';
import styled from '../styled';
import { App } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState, UserState, AuthState, ActivityStatusState];
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

class ForceConnect extends React.Component<Props> {
  componentDidMount() {
    this.fetchApps();
  }
  fetchApps = async () => {
    const [appState, , , activityStatusState] = this.props.states;
    activityStatusState.show('Loading');

    const [connections, spokes, apps] = await Promise.all([
      agent.company.connection.list(),
      agent.user.spoke.get('mobile'),
      agent.user.service.list(),
    ]);
    const fullApps = await Promise.all(
      apps.map(app => agent.user.service.get(app.key))
    );
    appState.setState({ connections, spokes, apps: fullApps });
    activityStatusState.dismiss();
  };

  onPress = (app: App) => {
    this.props.navigation.navigate(SCREENS[SCREENS.APP_DETAIL], app);
  };

  render() {
    const [appState] = this.props.states;
    return (
      <P.Container hasPadding style={{ backgroundColor: '#fff' }}>
        <ScrollView>
          <Title style={{ textAlign: 'center' }}>Connect your apps</Title>
          <SubTitle style={{ textAlign: 'center', color: '#999' }}>
            Choose from our supported apps to connect to your dashboard
          </SubTitle>
          <AvaibleAppContainer>
            {appState.availableApps.map((app: App) => (
              <AvaibleApp key={app.key} onPress={() => this.onPress(app)}>
                <AvaibleAppImg source={{ uri: app.squareLogo }} />
                <AvaibleAppTextView>
                  <AvaibleAppLabel>{app.name}</AvaibleAppLabel>
                </AvaibleAppTextView>
              </AvaibleApp>
            ))}
          </AvaibleAppContainer>
        </ScrollView>
      </P.Container>
    );
  }
}

export default SubscribeHOC([
  appState,
  userState,
  authContainer,
  activityStatusState,
])(withNavigation(ForceConnect));
