import React from 'react';
import { Image, Linking, ScrollView, View } from 'react-native';
import { human } from 'react-native-typography';
import { NavigationScreenProp } from 'react-navigation';
import { Styles } from 'styled-components';
import { Container as UnContainer, Subscribe } from 'unstated';
import { scale } from '../scale';

import agent from '../agent';

import Link from '../components/Link';
import { imgs } from '../osp';
import { Container, Text, Touchable } from '../primitives';
import { SCREENS } from '../routes/constants';
import appsContainer, { Apps } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled, { th } from '../styled';
import { App } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  containers: Array<UnContainer<any>>;
}

const Title = styled(Text)`
  ${human.title1Object as Styles};
  margin: ${scale(20)}px;
  margin-left: 0;
`;

const ConnectedApp = styled(Touchable)`
  flex: 1;
  width: 100px;
  align-items: center;
  margin: ${scale(10)}px;
`;
const ConnectedAppImg = styled(Image)`
  margin: ${scale(10)}px;
`;
const ConnectedAppLabel = styled(Text)`
  font-size: ${scale(12)}px;
  color: ${th('color.grey')};
  flex-wrap: wrap;
  text-align: center;
`;
const AvaibleAppContainer = styled(Container)`
  background-color: #fff;
  border-top-color: #eee;
  border-bottom-color: #eee;
  border-top-width: 1px;
  border-bottom-width: 1px;
`;
const AvaibleApp = styled(Touchable)`
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
const AvaibleAppLabel = styled(Text)`
  font-size: ${scale(12)}px;
`;
const AvaibleAppSum = styled(Text).attrs(() => ({ numberOfLines: 3 }))`
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
const AvaibleAppOpText = styled(Text)`
  color: ${th('color.grey')};
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
    console.log(apps);
  };

  public onPress(app: App) {
    this.props.navigation.push(SCREENS[SCREENS.APP_DETAIL], app);
  }
  public suggestApp = () => {
    const texts = [
      'Hey 9Spokes team!',
      '',
      "A service that I use isn't currently supported on the 9Spokes mobile app and it would be great if you could consider supporting it!",
      '',
      'Here are my details:',
      'Name:',
      'Nicolas Jiang',
      '',
      'Company name:',
      'nick company test',
      '',
      '9Spokes username:',
      'nicolas.jiang@9spokes.com',
    ];

    Linking.openURL('mailto:support@example.com?subject=SendMail&body=' + texts.join('\n'));
  };
  public render() {
    return (
      <Subscribe to={[Apps]}>
        {(apps: Apps) => (
          <Container>
            <ScrollView>
              <Container padding>
                <View>
                  <Title>My Connected Apps</Title>
                </View>
              </Container>

              <ScrollView horizontal={true} style={{ backgroundColor: '#fff' }}>
                {apps.availableApps.map((app: App) => (
                  <ConnectedApp key={app.key} onPress={() => this.onPress(app)}>
                    <ConnectedAppImg source={imgs[app.key]} />
                    <ConnectedAppLabel>{app.shortName || app.name}</ConnectedAppLabel>
                  </ConnectedApp>
                ))}
              </ScrollView>

              <Container padding>
                <View>
                  <Title>Available Apps</Title>
                </View>
              </Container>
              <AvaibleAppContainer>
                {apps.availableApps.map((app: App) => (
                  <AvaibleApp key={app.key} onPress={() => this.onPress(app)}>
                    <AvaibleAppImg source={imgs[app.key]} />
                    <AvaibleAppTextView>
                      <AvaibleAppLabel>{app.name}</AvaibleAppLabel>
                      <AvaibleAppSum>{app.summary}</AvaibleAppSum>
                    </AvaibleAppTextView>
                    <AvaibleAppOp>
                      <AvaibleAppOpText> > </AvaibleAppOpText>
                    </AvaibleAppOp>
                  </AvaibleApp>
                ))}
              </AvaibleAppContainer>

              <SuggestAppLink>
                <Link title="Dont't see your apps? Tell us what you use" onPress={this.suggestApp} />
              </SuggestAppLink>
            </ScrollView>
          </Container>
        )}
      </Subscribe>
    );
  }
}

export default SubscribeHOC([appsContainer])(AppList);
