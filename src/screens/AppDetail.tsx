import React from 'react';
import { View, Text, SectionList, Button, ActivityIndicator } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Subscribe, Container as UnContainer } from 'unstated';
import { Apps } from '../states/Apps';
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class extends React.Component<Props> {
  render() {
    const { navigation } = this.props;
    const appKey = navigation.getParam('key');
    return (
      <Subscribe to={[Apps]}>
        {(apps: Apps) => {
          const c = apps.connectionStatus(appKey);
          console.log(c);
          return (
            <View>
              <Text>{appKey}</Text>
              <Text>{c.connection}</Text>
              <Text>{c.connected}</Text>
            </View>
          );
        }}
      </Subscribe>
    );
  }
}
