import { Constants, Linking, WebBrowser } from 'expo';
import React from 'react';
import { Image, Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import agent from '../agent';
import Select from '../components/Select';
import Lock from '../Lock';
import * as P from '../primitives';
import { scale } from '../scale';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled from '../styled';
import { ACTIVITY_TYPES, Entity, Workflow } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState];
}

interface State {
  entities: Entity[];
  step: ACTIVITY_TYPES;
}

const AppImg = styled(Image)`
  height: ${scale(100)}px;
  width: ${scale(200)}px;
  align-self: center;
`;
export class AppConnectScreen extends React.Component<Props, State> {
  public state = {
    entities: [],
    step: ACTIVITY_TYPES.CLIENT_INIT,
  } as State;

  public componentDidMount() {
    this.startConnection();
  }

  public async startConnection() {
    try {
      const appKey = this.props.navigation.getParam('key');
      const [appState] = this.props.states;
      const appDetail = appState.appDetail(appKey);

      let { connection } = appDetail;
      const company = agent.company;
      let workflow: Workflow;
      try {
        workflow = await company.workflow.create(appKey);
      } catch (err) {
        console.log('create workflow err');
        try {
          workflow = await company.workflow.resume(appKey);
        } catch (err) {
          console.log('resume workflow err');

          workflow = await company.workflow.reconnect(appKey);
        }
      }
      let authResult;
      let { activities } = workflow;

      while (activities.length > 0) {
        const act = activities[0];
        for (const step of act.steps) {
          console.log('doing', act.type);
          this.setState({ step: act.type });

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
      agent.company.widget.addByAppKey(appKey);
      this.setState({ step: ACTIVITY_TYPES.SUCCEEDED });
    } catch (err) {
      this.setState({ step: ACTIVITY_TYPES.ERRORED });
    }
  }
  public render() {
    const appKey = this.props.navigation.getParam('key');
    const [appState] = this.props.states;
    const appDetail = appState.appDetail(appKey);
    const { step } = this.state;

    return (
      <P.Container padding>
        {step === ACTIVITY_TYPES.CLIENT_INIT && (
          <P.Container hcenter>
            <P.H2>Connect to {appDetail.app.name}</P.H2>
          </P.Container>
        )}
        {step === ACTIVITY_TYPES.SUBMIT_ENTITY && (
          <P.Container hcenter>
            <P.H2>Select an entity</P.H2>
            <Text>Select one of the following entities for your account</Text>
            {this.state.entities.map(e => (
              <Select title={e.name} onPress={() => this.chooseEntity(e)} key={e.id} />
            ))}
          </P.Container>
        )}
        {step === ACTIVITY_TYPES.SUCCEEDED && (
          <P.Container vcenter>
            <AppImg style={{}} source={{ uri: appDetail.app.logo }} resizeMode="contain" />
            <P.H2>SUCCEEDED</P.H2>
          </P.Container>
        )}
      </P.Container>
    );
  }
  private chooseEntity(e: Entity) {
    Lock.release(e);
  }
}

export default SubscribeHOC([appState])(AppConnectScreen);
