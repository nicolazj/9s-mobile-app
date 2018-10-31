import React from 'react';
import { View, Image } from 'react-native';
import { Subscribe, Container as UnContainer } from 'unstated';
import { NavigationScreenProp } from 'react-navigation';
import { human } from 'react-native-typography';
import { Styles } from 'styled-components';
import { scale } from '../scale';

import agent from '../agent';

import { Container, Touchable } from '../primitives';
import appsContainer, { Apps } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import { Text } from '../primitives';
import styled from '../styled';
import { imgs } from '../osp';
import { SCREENS } from '../routes/constants';
import { App } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  containers: UnContainer<any>[];
}

const Title = styled(Text)`
  ${human.title1Object as Styles};
  margin: ${scale(20)}px;
  margin-left: 0;
`;

class AppList extends React.Component<Props> {
  componentDidMount() {
    this.fetchConnections();
    this.fetchSpokes();
    this.fetchApps();
  }
  fetchConnections = async () => {
    const connections = await agent.company.connection.list();
    const [appContainer] = this.props.containers;
    appContainer.setState({ connections });
  };
  fetchSpokes = async () => {
    const spokes = await agent.user.spoke.get('mobile');
    const [appContainer] = this.props.containers;
    appContainer.setState({ spokes });
  };
  fetchApps = async () => {
    const apps = await agent.user.service.list();
    const [appContainer] = this.props.containers;
    appContainer.setState({ apps });
  };
  onPress(app: App) {
    this.props.navigation.push(SCREENS[SCREENS.APP_DETAIL], app);
  }
  render() {
    return (
      <Container padding>
        <Subscribe to={[Apps]}>
          {(apps: Apps) => (
            <View>
              <View>
                <Title>My Apps</Title>
                <View>
                  {apps.purchasedApps.map(app => (
                    <Touchable key={app.key} onPress={() => this.onPress(app)}>
                      <Image source={imgs[app.key]} />
                      <Text>{app.name}</Text>
                    </Touchable>
                  ))}
                </View>
              </View>
              <View>
                <Title>Available Apps</Title>
                {apps.availableApps.map(app => (
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
