import React from 'react';
import { Image, Linking, ScrollView, View } from 'react-native';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

import agent from '../agent';
import Link from '../components/Link';
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
import styled, { th } from '../styled';
import { App } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState, UserState, AuthState, ActivityStatusState];
}

const Title = styled(P.H1)`
  margin: ${scale(20)}px;
  margin-left: 0;
`;

const ConnectedApp = styled(P.Touchable)`
  flex: 1;
  width: 100px;
  align-items: center;
  margin: ${scale(10)}px;
`;
const ConnectedAppImg = styled(Image)`
  margin: ${scale(10)}px;
  height: ${scale(40)}px;
  width: ${scale(40)}px;
`;
const ConnectedAppLabel = styled(P.Text)`
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
const AvaibleApp = styled(P.Touchable)`
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

const SuggestAppLink = styled(View)`
  align-items: center;
  padding-top: ${scale(20)}px;
  padding-bottom: ${scale(50)}px;
`;
class ForceConnect extends React.Component<Props> {
  componentDidMount() {
    this.fetchApps();
  }
  fetchApps = async () => {
    const [appState, __, ___, activityStatusState] = this.props.states;
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
    console.log(this.props.navigation);
    this.props.navigation.navigate(SCREENS[SCREENS.APP_DETAIL], app);
  };

  render() {
    const [appState] = this.props.states;
    return (
      <P.Container>
        <ScrollView>
          <AvaibleAppContainer>
            {appState.availableApps.map((app: App) => (
              <AvaibleApp key={app.key} onPress={() => this.onPress(app)}>
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
