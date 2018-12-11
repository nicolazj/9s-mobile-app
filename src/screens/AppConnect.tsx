import { Constants, Linking, WebBrowser } from 'expo';
import React from 'react';
import { Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import agent from '../agent';
import Button from '../components/Button';
import Lock from '../Lock';
import { Container } from '../primitives';
import { AppDetail } from '../states/Apps';
import { ACTIVITY_TYPES, Entity, Workflow } from '../types';
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

interface State {
  entities: Entity[];
  type: ACTIVITY_TYPES;
}
export default class extends React.Component<Props, State> {
  public state = {
    entities: [],
    type: ACTIVITY_TYPES.CLIENT_INIT,
  } as State;

  public componentDidMount() {
    this.startConnection();
  }

  public async startConnection() {
    try {
      const appDetail = this.props.navigation.state.params as AppDetail;
      console.log(appDetail);
      const { appKey } = appDetail;
      let { connection } = appDetail;
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
      this.setState({ type: ACTIVITY_TYPES.SUCCEEDED });
    } catch (err) {
      this.setState({ type: ACTIVITY_TYPES.ERRORED });
    }
  }
  public render() {
    const connectionStatus = this.props.navigation.state.params as AppDetail;
    const { appKey } = connectionStatus;
    return (
      <Container padding>
        <View>
          <Text>{appKey}</Text>
          <Text>Connecting </Text>

          {this.state.entities.map(e => (
            <Button title={e.name} onPress={() => this.chooseEntity(e)} key={e.id} />
          ))}
        </View>
      </Container>
    );
  }
  private chooseEntity(e: Entity) {
    Lock.release(e);
  }
}
