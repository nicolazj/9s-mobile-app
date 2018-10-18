import React from 'react';
import { View, Text, SectionList, Button, ActivityIndicator } from 'react-native';
import { AuthSession } from 'expo';
import client from '../client';
import { App, Entity, Workflow, Activity } from '../types';
import { NavigationScreenProp } from 'react-navigation';

import Lock from '../Lock';

interface State {
  app?: App;
  entities: Entity[];
}
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class WidgetDetail extends React.Component<Props, State> {
  state: State = {
    app: undefined,
    entities: [],
  };
  async componentDidMount() {
    const { navigation } = this.props;

    const appKey = navigation.getParam('appKey');
    if (client.user) {
      const app = await client.user.service.get(appKey);
      this.setState({ app });
    }
  }
  async onPress(appKey: string) {
    console.log('connecting');
    try {
      if (client.company) {
        const company = client.company;

        const connections = await company.connection.list();

        let connection = connections.find(c => c.appKey === appKey);

        console.log(connection);
        let workflow: Workflow;
        try {
          workflow = await company.workflow.create(appKey);
        } catch (err) {
          console.log('there exists workflow');
          workflow = await company.workflow.reconnect(appKey);
        }

        let { activities } = workflow;
        let authResult;

        let act: Activity | undefined;
        while (((act = activities.shift()), act)) {
          for (let step of act.steps) {
            console.log('doing', act.type, step);
            if (act.type === 'remove-connection') {
              const arr = step.href.split('/');
              await company.connection.delete(arr[arr.length - 1]);
            } else if (act.type === 'initiate-connection') {
              if (connection) {
                console.log('connection exists');
              } else {
                try {
                  connection = await company.connection.create(appKey);
                  console.log('connection', connection);
                } catch (err) {
                  console.log(err);
                }
              }
            } else if (act.type === 'redirect-user-agent') {
              let redirectUrl = AuthSession.getRedirectUrl();
              console.log('redirectUrl', redirectUrl);
              authResult = await AuthSession.startAsync({
                authUrl: step.href,
              });
              // console.log(authResult);
            } else if (act.type === 'submit-entity') {
              const entity = await Lock.hold();
              console.log('select entity', entity);
              if (connection) {
                const r = await company.entities.put(connection.id, { _embedded: { selectedEntity: entity.id } });
              }
            } else if (act.type === 'get-available-entities') {
              if (connection) {
                const entities = await company.entities.list(connection.id);
                this.setState({ entities });
                console.log('entities====', entities);
              }
            } else if (act.type === 'submit-authorization') {
              if (connection && authResult && 'params' in authResult) {
                const r = await company.connection.sendAuth(connection.id, {
                  ...authResult.params,
                  callback: step.id,
                  serviceID: appKey,
                });
              }
            }
            const r = await company.workflow.update(workflow.id, act.id, step.id);

            activities = activities.concat(r.activities);
          }
        }
      }
    } catch (err) {
      console.log('err', JSON.stringify(err, null, 2));
    }
  }
  select(e: Entity) {
    Lock.release(e);
  }
  render() {
    const { app, entities } = this.state;
    if (app) {
      const { shortName, features, key } = app;

      return (
        <View>
          <Text>{shortName}</Text>
          <Text>Feature:</Text>
          {features.map(f => (
            <Text key={f}>{f}</Text>
          ))}
          <Button title={'Connect'} onPress={() => this.onPress(key)} />

          {entities.map(m => (
            <Button key={m.id} title={m.name} onPress={() => this.select(m)} />
          ))}
        </View>
      );
    } else return null;
  }
}
