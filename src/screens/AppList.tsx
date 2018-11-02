import React from 'react';
import { Image, View } from 'react-native';
import { human } from 'react-native-typography';
import { NavigationScreenProp } from 'react-navigation';
import { Styles } from 'styled-components';
import { Container as UnContainer, Subscribe } from 'unstated';
import { scale } from '../scale';

import agent from '../agent';

import { imgs } from '../osp';
import { Container, Touchable } from '../primitives';
import { Text } from '../primitives';
import { SCREENS } from '../routes/constants';
import appsContainer, { Apps } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled from '../styled';
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

class AppList extends React.Component<Props> {
  public componentDidMount() {
    this.fetchConnections();
    this.fetchSpokes();
    this.fetchApps();
  }
  public fetchConnections = async () => {
    const connections = await agent.company.connection.list();
    const [appContainer] = this.props.containers;
    appContainer.setState({ connections });
  }
  public fetchSpokes = async () => {
    const spokes = await agent.user.spoke.get('mobile');
    const [appContainer] = this.props.containers;
    appContainer.setState({ spokes });
  }
  public fetchApps = async () => {
    const apps = await agent.user.service.list();
    const [appContainer] = this.props.containers;
    appContainer.setState({ apps });
  }
  public onPress(app: App) {
    this.props.navigation.push(SCREENS[SCREENS.APP_DETAIL], app);
  }
  public render() {
    return (
      <Container padding>
        <Subscribe to={[Apps]}>
          {(apps: Apps) => (
            <View>
              <View>
                <Title>My Apps</Title>
                <View>
                  {apps.purchasedApps.map((app) => (
                    <Touchable key={app.key} onPress={() => this.onPress(app)}>
                      <Image source={imgs[app.key]} />
                      <Text>{app.name}</Text>
                    </Touchable>
                  ))}
                </View>
              </View>
              <View>
                <Title>Available Apps</Title>
                {apps.availableApps.map((app) => (
                  <Touchable key={app.key} onPress={() => this.onPress(app)}>
                    <Image source={imgs[app.key]} />
                    <Text>{app.name}</Text>
                  </Touchable>
                ))}
              </View>
            </View>
          )}
        </Subscribe>
      </Container>
    );
  }
}

export default SubscribeHOC([appsContainer])(AppList);
