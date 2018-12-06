import React from 'react';
import { Image, Linking, ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Container as UnContainer } from 'unstated';
import { scale } from '../scale';

import agent from '../agent';

import Link from '../components/Link';
import { imgs } from '../osp';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import appsContainer, { Apps } from '../states/Apps';
import authContainer, { Auth } from '../states/Auth';
import { SubscribeHOC } from '../states/helper';
import userContainer, { User } from '../states/User';
import styled, { th } from '../styled';
import { App } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  containers: Array<UnContainer<any>>;
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
class AppList extends React.Component<Props> {
  public componentDidMount() {
    this.fetchApps();
  }
  public fetchApps = async () => {
    const [connections, spokes, apps] = await Promise.all([
      agent.company.connection.list(),
      agent.user.spoke.get('mobile'),
      agent.user.service.list(),
    ]);
    const [appContainer] = this.props.containers;
    appContainer.setState({ connections, spokes, apps });
  };

  public onPress(app: App) {
    this.props.navigation.push(SCREENS[SCREENS.APP_DETAIL], app);
  }
  public suggestApp = () => {
    const [_, userContainer, authContainer] = this.props.containers as [any, User, Auth];
    const company = userContainer.state.companies.find(c => c.companyUuid === authContainer.state.companyUuid);
    const { me } = userContainer.state;
    const texts = [
      'Hey 9Spokes team!',
      '',
      "A service that I use isn't currently supported on the 9Spokes mobile app and it would be great if you could consider supporting it!",
      '',
      'Here are my details:',
      'Name:',
      `${me.firstName} ${me.lastName}`,
      '',
      'Company name:',
      company ? company.companyName : '',
      '',
      '9Spokes username:',
      me.emailAddress,
    ];

    Linking.openURL('mailto:support@9spokes.com?subject=App Support Request&body=' + texts.join('\n'));
  };
  public render() {
    const [appContainer] = this.props.containers as [Apps];
    return (
      <P.Container>
        <ScrollView>
          <P.Container padding>
            <View>
              <Title>My Connected Apps</Title>
            </View>
          </P.Container>

          <ScrollView horizontal={true} style={{ backgroundColor: '#fff' }}>
            {appContainer.purchasedApps.map((app: App) => (
              <ConnectedApp key={app.key} onPress={() => this.onPress(app)}>
                <ConnectedAppImg source={imgs[app.key]} />
                <ConnectedAppLabel>{app.shortName || app.name}</ConnectedAppLabel>
              </ConnectedApp>
            ))}
          </ScrollView>

          <P.Container padding>
            <View>
              <Title>Available Apps</Title>
            </View>
          </P.Container>
          <AvaibleAppContainer>
            {appContainer.availableApps.map((app: App) => (
              <AvaibleApp key={app.key} onPress={() => this.onPress(app)}>
                <AvaibleAppImg source={imgs[app.key]} />
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

          <SuggestAppLink>
            <Link title="Dont't see your apps? Tell us what you use" onPress={this.suggestApp} />
          </SuggestAppLink>
        </ScrollView>
      </P.Container>
    );
  }
}

export default SubscribeHOC([appsContainer, userContainer, authContainer])(AppList);
