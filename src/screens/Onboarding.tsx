import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';

import * as P from '../primitives';

export class Onboarding extends React.Component {
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
        <P.Text>onboarding</P.Text>
      </View>
    );
  }
}

export default Onboarding;
