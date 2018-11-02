import { AuthSession, Constants, Linking, WebBrowser } from 'expo';
import React from 'react';
import { ActionSheetIOS, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Subscribe } from 'unstated';
import agent from '../agent';
import Lock from '../Lock';
import { Button, Container } from '../primitives';
import { SCREENS } from '../routes/constants';
import { Apps, ConnectionStatus } from '../states/Apps';
import { Activity, ACTIVITY_TYPES, App, Entity, Workflow } from '../types';
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class extends React.Component<Props> {
  // onPress = () => {
  //   this.props.navigation.navigate(SCREENS[SCREENS.APP_CONNECT]);
  // };

  public componentDidMount() {
    this.startConnection();
  }

  public async startConnection() {
    try {
      console.log('=====================================================>>>>>>>>');
      const connectionStatus = this.props.navigation.state.params as ConnectionStatus;
      console.log(connectionStatus);
      const { appKey } = connectionStatus;
      let { connection } = connectionStatus;
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

      while (activities.length > 0) {
        const act = activities[0];
        for (const step of act.steps) {
          console.log('doing', act.type);
          this.setState({ type: act.type });

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
              console.log('redirectUrl', Constants.linkingUri);
              const r = (await WebBrowser.openAuthSessionAsync(step.href)) as { type: string; url: string };
              if (r.type === 'success') {
                authResult = Linking.parse(r.url);
                console.log('authResult', authResult);
              }
              break;

            case ACTIVITY_TYPES.SUBMIT_ENTITY:
              const entity = await Lock.hold();
              console.log('select entity', entity);
              if (connection) {
                await company.entities.put(connection.id, { _embedded: { selectedEntity: entity.id } });
              }
              break;

            case ACTIVITY_TYPES.GET_AVAILABLE_ENTITIES:
              if (connection) {
                const entities = await company.entities.list(connection.id);
                this.setState({ entities });
              }
              break;

            case ACTIVITY_TYPES.SUBMIT_AUTHORIZATION:
              if (connection && authResult) {
                await company.connection.sendAuth(connection.id, {
                  ...authResult.queryParams,
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
  public render() {
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
