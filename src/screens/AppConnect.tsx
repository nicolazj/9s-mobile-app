import { Constants, Linking, WebBrowser } from 'expo';
import { Field, Formik } from 'formik';
import React from 'react';
import { Image, View } from 'react-native';
import {
  NavigationActions,
  NavigationScreenProp,
  StackActions,
} from 'react-navigation';

import { Ionicons } from '@expo/vector-icons';

import agent from '../agent';
import Button from '../components/Button';
import Select from '../components/Select';
import { FormikTextInput } from '../formik';
import Lock from '../Lock';
import log from '../logging';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import activityStatus, { ActivityStatusState } from '../states/ActivityStatus';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled, { scale, th } from '../styled';
import { ACTIVITY_TYPES, Entity, Workflow } from '../types';
import { object, requiredString } from '../validations';

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

const entityLock = new Lock<Entity>();

const accountLock = new Lock<{ account: string }>();

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
        log('create workflow err');
        try {
          workflow = await company.workflow.resume(appKey);
        } catch (err) {
          log('resume workflow err');

          workflow = await company.workflow.reconnect(appKey);
        }
      }
      let authResult;
      let { activities } = workflow;
      log('workflow start', workflow);
      while (activities.length > 0) {
        const act = activities[0];
        for (const step of act.steps) {
          log('doing', act.type);
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
              log('redirecting user to ...', step.href);
              const r = (await WebBrowser.openAuthSessionAsync(
                step.href,
                Constants.linkingUri
              )) as {
                type: string;
                url: string;
              };
              if (r.type === 'success') {
                log('sucess', r);
                authResult = Linking.parse(r.url);
                log('authResult', authResult);
              } else {
                log('cancel !!!!');
              }
              break;

            case ACTIVITY_TYPES.SUBMIT_ENTITY:
              const entity = await entityLock.hold();
              log('select entity', entity);
              if (connection) {
                await company.entities.put(connection.id, {
                  _embedded: { selectedEntity: entity.id },
                });
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
            case ACTIVITY_TYPES.SUBMIT_ACCOUNT:
              console.log('SUBMIT_ACCOUNT');

              const account = await accountLock.hold();

              if (connection) {
                await company.connection.sendAccount(connection.id, {
                  _embedded: account,
                });
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
          log(r);
          activities.shift();
          activities = activities.concat(r.activities);
        }
      }
      agent.company.widget.addByAppKey(appKey);
      this.setState({ step: ACTIVITY_TYPES.SUCCEEDED });
    } catch (err) {
      log('connect errored', err);
      this.setState({ step: ACTIVITY_TYPES.ERRORED });
    }
  }
  render() {
    const appKey = this.props.navigation.getParam('key');
    const [appState] = this.props.states;
    const appDetail = appState.appDetail(appKey);
    const { step } = this.state;

    return (
      <Container hasPadding>
        {step === ACTIVITY_TYPES.CLIENT_INIT && (
          <Container vcenter hcenter>
            <P.Title>Connect to {appDetail.app.name}</P.Title>
          </Container>
        )}
        {step === ACTIVITY_TYPES.SUBMIT_ENTITY && (
          <Container hcenter>
            <P.Title>Select an entity</P.Title>
            <P.SubTitle>
              Select one of the following entities for your account
            </P.SubTitle>
            {this.state.entities.map(e => (
              <Select
                title={e.name}
                onPress={() => this.chooseEntity(e)}
                key={e.id}
              />
            ))}
          </Container>
        )}
        {step === ACTIVITY_TYPES.SUBMIT_ACCOUNT && (
          <Container hcenter>
            <P.Title>Select an account</P.Title>
            <P.SubTitle>
              Please provide the following credentials to connect your {appKey}
              account
            </P.SubTitle>
            <Container hasMargin>
              <Formik
                initialValues={{
                  selectedAccount: '',
                }}
                validationSchema={object().shape({
                  selectedAccount: requiredString,
                })}
                onSubmit={this.submitAccount}
              >
                {({ handleSubmit }) => (
                  <View style={{ flex: 1 }}>
                    <Field
                      name="selectedAccount"
                      component={FormikTextInput}
                      placeholder="Store name"
                      returnKeyType="next"
                    />

                    <Button title="Continue" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
            </Container>
          </Container>
        )}

        {step === ACTIVITY_TYPES.SUCCEEDED && (
          <Container vcenter hcenter>
            <AppImg source={{ uri: appDetail.app.logo }} resizeMode="contain" />

            <Row>
              <Icon name="ios-checkmark-circle-outline" size={24} />
              <ConnectText>Connected</ConnectText>
            </Row>

            <P.SubTitle>
              We're busy setting up your widgets for you. Here are some examples
              of what they'll look like when they're ready.
            </P.SubTitle>
            <Button
              onPress={() => {
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({
                      routeName: 'Tabs',
                    }),
                  ],
                });
                this.props.navigation.dispatch(resetAction);
                this.props.navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
              }}
              title="Done"
            />
          </Container>
        )}

        {step === ACTIVITY_TYPES.ERRORED && (
          <Container vcenter hcenter>
            <P.H2>Ooops</P.H2>
            <P.SubTitle>please try again</P.SubTitle>
          </Container>
        )}
      </Container>
    );
  }
  chooseEntity(e: Entity) {
    entityLock.release(e);
  }

  submitAccount(values) {
    accountLock.release(values);
  }
}

export default SubscribeHOC([appState, activityStatus])(AppConnectScreen);
