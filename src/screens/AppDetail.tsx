import React from 'react';
import { Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Subscribe } from 'unstated';
import Button from '../components/Button';
import { Container } from '../primitives';
import { SCREENS } from '../routes/constants';
import { AppState, ConnectionStatus } from '../states/Apps';
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class extends React.Component<Props> {
  public onPress = (connectionStatus: ConnectionStatus) => {
    this.props.navigation.navigate(SCREENS[SCREENS.APP_CONNECT], connectionStatus);
  };
  public render() {
    const appKey = this.props.navigation.getParam('key');
    return (
      <Container padding>
        <Subscribe to={[AppState]}>
          {(apps: AppState) => {
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
