import { Linking } from 'expo';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { Field, Formik } from 'formik';
import React from 'react';
import { Image, View } from 'react-native';
import {
    NavigationActions, NavigationScreenProp, StackActions
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
import * as Browser from '../services/browser';
import { dismiss, show } from '../stores/activityStatus';
import { getAppDetail } from '../stores/osp';
import styled, { scale, th } from '../styled';
import { ACTIVITY_TYPES, Entity, Workflow } from '../types';
import { object, requiredString } from '../validations';

interface Props {
  navigation: NavigationScreenProp<any, any>;
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

const AppConnectScreen: React.FC<Props> = ({ navigation }) => {
  const [entities, setEntities] = React.useState<Entity[]>([]);
  const [step, setStep] = React.useState<ACTIVITY_TYPES>(
    ACTIVITY_TYPES.CLIENT_INIT
  );

  const appKey = navigation.getParam('key');
  const appDetail = getAppDetail(appKey);

  const chooseEntity = (e: Entity) => {
    entityLock.release(e);
  };

  const submitAccount = (values: any) => {
    accountLock.release(values);
  };

  React.useEffect(() => {
    startConnection();
  }, []);

  const startConnection = async () => {
    try {
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
          setStep(act.type);
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
              const r = (await Browser.open(
                step.href,
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
                show('Loading entities');
                const entities = await company.entities.list(connection.id);
                setEntities(entities);
                dismiss();
              }
              break;
            case ACTIVITY_TYPES.SUBMIT_ACCOUNT:
              const account = await accountLock.hold();

              if (connection) {
                await company.connection.sendAccount(connection.id, {
                  _embedded: account,
                });
              }

              break;
            case ACTIVITY_TYPES.SUBMIT_AUTHORIZATION:
              if (connection && authResult) {
                show('Connecting');
                await company.connection.sendAuth(connection.id, {
                  ...authResult.queryParams,
                  callback: step.id,
                  serviceID: appKey,
                });
                dismiss();
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
      setStep(ACTIVITY_TYPES.SUCCEEDED);
    } catch (err) {
      log('connect errored', err);
      setStep(ACTIVITY_TYPES.ERRORED);
    }
  };

  return (
    <Container hasPadding>
      {step === ACTIVITY_TYPES.CLIENT_INIT && (
        <Container vcenter hcenter>
          <P.SubTitle>Connect to {appDetail.app!.name}</P.SubTitle>
        </Container>
      )}
      {step === ACTIVITY_TYPES.REDIRECT_USER_AGENT && (
        <Container vcenter hcenter>
          <P.SubTitle>Connecting to {appDetail.app!.name}</P.SubTitle>
        </Container>
      )}
      {step === ACTIVITY_TYPES.SUBMIT_ENTITY && (
        <Container hcenter>
          <P.Title>Select an entity</P.Title>
          <P.SubTitle>
            Select one of the following entities for your account
          </P.SubTitle>
          {entities.map(e => (
            <Select title={e.name} onPress={() => chooseEntity(e)} key={e.id} />
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
              onSubmit={submitAccount}
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
          <AppImg source={{ uri: appDetail.app!.logo }} resizeMode="contain" />

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
              navigation.dispatch(resetAction);
              navigation.navigate(SCREENS[SCREENS.DASHBOARD]);
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
};

export default AppConnectScreen;
