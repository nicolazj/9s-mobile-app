import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Subscribe } from 'unstated';
import { Container, Button } from '../primitives';
import { Apps, ConnectionStatus } from '../states/Apps';
import { SCREENS } from '../routes/constants';
import agent from '../agent';
import { App, Entity, Workflow, Activity, ACTIVITY_TYPES } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class extends React.Component<Props> {
  // onPress = () => {
  //   this.props.navigation.navigate(SCREENS[SCREENS.APP_CONNECT]);
  // };

  componentDidMount() {
    this.startConnection();
  }

  async startConnection() {
    const connectionStatus = this.props.navigation.state.params as ConnectionStatus;
    const { appKey, connection, connected } = connectionStatus;

    let workflow: Workflow;
    try {
      if (connection) {
        workflow = await agent.company.workflow.resume(appKey);
      } else {
        workflow = await agent.company.workflow.create(appKey);
      }
    } catch (err) {
      console.log('there exists workflow');
    }
  }
  render() {
    const connectionStatus = this.props.navigation.state.params as ConnectionStatus;
    console.log(connectionStatus);
    const { appKey } = connectionStatus;
    return (
      <Container padding>
        <View>
          <Text>{appKey}</Text>
          <Text>Connecting </Text>
        </View>
      </Container>
    );
  }
}
