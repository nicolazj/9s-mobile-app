import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Subscribe } from 'unstated';
import { AuthSession } from 'expo';
import { Container, Button } from '../primitives';
import { Apps, ConnectionStatus } from '../states/Apps';
import { SCREENS } from '../routes/constants';
import agent from '../agent';
import { App, Entity, Workflow, Activity, ACTIVITY_TYPES } from '../types';
import Lock from '../Lock';
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

function getConnectionId(href: string) {
  const r = /\/connection\/(.*)$/gm.exec(href);
  if (r) return r[1];
}
export default class extends React.Component<Props> {
  // onPress = () => {
  //   this.props.navigation.navigate(SCREENS[SCREENS.APP_CONNECT]);
  // };

  componentDidMount() {
    this.startConnection();
  }

  async startConnection() {
    console.log('=====================================================>>>>>>>>');
    const connectionStatus = this.props.navigation.state.params as ConnectionStatus;
    console.log(connectionStatus);
    let { appKey, connection } = connectionStatus;
    const company = agent.company;
    let workflow: Workflow;
    try {
      workflow = await company.workflow.create(appKey);
    } catch (err) {
      console.log('there exists workflow', err.response.data);
      workflow = await company.workflow.resume(appKey);
    }
    let authResult;
    let { activities } = workflow;

    try {
      while (activities.length > 0) {
        let act = activities[0];
        for (let step of act.steps) {
          console.log('doing', act, step);

          switch (act.type) {
            case ACTIVITY_TYPES.INITIATE_CONNECTION:
              if (!connection) {
                connection = await company.connection.create(appKey);
              }
              break;
            case ACTIVITY_TYPES.REMOVE_CONNECTION:
              if (connection) {
                await company.connection.delete(connection.id);
              }
              break;

            case ACTIVITY_TYPES.REDIRECT_USER_AGENT:
              let redirectUrl = AuthSession.getRedirectUrl();
              console.log('redirectUrl', redirectUrl);
              authResult = await AuthSession.startAsync({
                authUrl: step.href,
              });
              break;

            case ACTIVITY_TYPES.SUBMIT_ENTITY:
              const entity = await Lock.hold();
              console.log('select entity', entity);
              if (connection) {
                const r = await company.entities.put(connection.id, { _embedded: { selectedEntity: entity.id } });
              }
              break;

            case ACTIVITY_TYPES.GET_AVAILABLE_ENTITIES:
              if (connection) {
                const entities = await company.entities.list(connection.id);
                this.setState({ entities });
              }
              break;

            case ACTIVITY_TYPES.SUBMIT_AUTHORIZATION:
              if (connection && authResult && 'params' in authResult) {
                await company.connection.sendAuth(connection.id, {
                  ...authResult.params,
                  callback: step.id,
                  serviceID: appKey,
                });
              }
              break;
          }

          const r = await company.workflow.update(workflow.id, act.id, step.id);
          activities.shift();
          activities = activities.concat(r.activities);
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
    }
  }
  render() {
    const connectionStatus = this.props.navigation.state.params as ConnectionStatus;
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
