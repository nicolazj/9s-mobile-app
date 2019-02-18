import { Constants, Linking, WebBrowser } from 'expo';
import React from 'react';
import { Image, View } from 'react-native';
import { NavigationActions, NavigationScreenProp, StackActions } from 'react-navigation';

import { Ionicons } from '@expo/vector-icons';

import agent from '../agent';
import Button from '../components/Button';
import Select from '../components/Select';
import Lock from '../Lock';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { scale } from '../scale';
import activityStatus, { ActivityStatusState } from '../states/ActivityStatus';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled, { th } from '../styled';
import { ACTIVITY_TYPES, Entity, Workflow } from '../types';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState, ActivityStatusState];
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

const Title = styled(P.H2)`
  color: #aaa;
`;
const SubTitle = styled(P.Text)`
  color: #aaa;
`;
const Container = styled(P.Container)`
  background-color: #fff;
`;
const ConnectText = styled(P.Text)`
  color: ${th('color.main')};
  padding: 0 4px;
`;
const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const Icon = styled(Ionicons).attrs(props => ({
  color: th('color.main')(props),
}))``;
export class AppConnectScreen extends React.Component<Props, State> {
  state = {
    entities: [],
    step: ACTIVITY_TYPES.CLIENT_INIT,
  } as State;

  componentDidMount() {
    this.startConnection();
  }

  async startConnection() {
    try {
      const appKey = this.props.navigation.getParam('key');
      const [appState, activityStatus] = this.props.states;
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
              console.log('cancel !!!!');
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
                activityStatus.show('Loading entities');
                const entities = await company.entities.list(connection.id);
                this.setState({ entities });
                activityStatus.dismiss();
              }
              break;

            case ACTIVITY_TYPES.SUBMIT_AUTHORIZATION:
              if (connection && authResult) {
                activityStatus.show('Connecting');
                await company.connection.sendAuth(connection.id, {
                  ...authResult.queryParams,
                  callback: step.id,
                  serviceID: appKey,
                });
                activityStatus.dismiss();
              } else throw 'no auth result';
              break;
          }

          const r = await company.workflow.update(workflow.id, act.id, step.id);
          console.log(r);
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
  render() {
    const appKey = this.props.navigation.getParam('key');
    const [appState] = this.props.states;
    const appDetail = appState.appDetail(appKey);
    const { step } = this.state;

    return (
      <Container padding>
        {step === ACTIVITY_TYPES.CLIENT_INIT && (
          <P.Container vcenter hcenter>
            <Title>Connect to {appDetail.app.name}</Title>
          </P.Container>
        )}
        {step === ACTIVITY_TYPES.SUBMIT_ENTITY && (
          <Container hcenter>
            <Title>Select an entity</Title>
            <SubTitle>Select one of the following entities for your account</SubTitle>
            {this.state.entities.map(e => (
              <Select title={e.name} onPress={() => this.chooseEntity(e)} key={e.id} />
            ))}
          </Container>
        )}
        {step === ACTIVITY_TYPES.SUCCEEDED && (
          <Container vcenter hcenter>
            <AppImg source={{ uri: appDetail.app.logo }} resizeMode="contain" />

            <Row>
              <Icon name="ios-checkmark-circle-outline" size={24} />
              <ConnectText>Connected</ConnectText>
            </Row>

            <SubTitle>
              We're busy setting up your widgets for you. Here are some examples of what they'll look like when they're
              ready.
            </SubTitle>
            <Button
              onPress={() => {
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: SCREENS[SCREENS.MARKETPLACE_HOME] })],
                });
                this.props.navigation.dispatch(resetAction);
                this.props.navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
              }}
              title="Done"
            />
          </Container>
        )}

        {step === ACTIVITY_TYPES.ERRORED && (
          <P.Container vcenter>
            <P.H2>ERRORED</P.H2>
          </P.Container>
        )}
      </Container>
    );
  }
  chooseEntity(e: Entity) {
    Lock.release(e);
  }
}

export default SubscribeHOC([appState, activityStatus])(AppConnectScreen);
