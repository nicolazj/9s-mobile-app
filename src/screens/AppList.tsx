import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { human } from 'react-native-typography';
import { NavigationScreenProp } from 'react-navigation';
import { Styles } from 'styled-components';
import { Container as UnContainer, Subscribe } from 'unstated';
import { scale } from '../scale';

import agent from '../agent';

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
              {apps.availableApps.map((app: App) => (
                <Touchable key={app.key} onPress={() => this.onPress(app)}>
                  <Image source={imgs[app.key]} />
                  <Text>{app.name}</Text>
                </Touchable>
              ))}
            </ScrollView>
          </Container>
        )}
      </Subscribe>
    );
  }
}

export default SubscribeHOC([appsContainer])(AppList);
