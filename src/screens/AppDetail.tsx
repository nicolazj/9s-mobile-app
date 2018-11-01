import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Subscribe } from 'unstated';
import { Container, Button } from '../primitives';
import { Apps, ConnectionStatus } from '../states/Apps';
import { SCREENS } from '../routes/constants';
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class extends React.Component<Props> {
  onPress = (connectionStatus: ConnectionStatus) => {
    this.props.navigation.navigate(SCREENS[SCREENS.APP_CONNECT], connectionStatus);
  };
  render() {
    const appKey = this.props.navigation.getParam('key');
    return (
      <Container padding>
        <Subscribe to={[Apps]}>
          {(apps: Apps) => {
            const connectionStatus = apps.connectionStatus(appKey);
            return (
              <View>
                <Text>{appKey}</Text>

                {connectionStatus.connected ? (
                  <Button title="Remove connection" onPress={() => console.log('remove ')} />
                ) : (
                  [
                    <Button key="trial" title="Get a trial" />,
                    connectionStatus.connection ? (
                      <Button key="resume" title="Resume" onPress={() => this.onPress(connectionStatus)} />
                    ) : (
                      <Button key="connect" title="Connect" onPress={() => this.onPress(connectionStatus)} />
                    ),
                  ]
                )}
              </View>
            );
          }}
        </Subscribe>
      </Container>
    );
  }
}
