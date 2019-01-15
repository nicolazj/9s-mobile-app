import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import Walkthrough from '../components/Walkthrough';

const Walkthrough1 = () => {
  return (
    <Image
      style={{ height: 100, width: 100 }}
      source={{
        uri:
          'https://images.unsplash.com/photo-1547403890-368794502c83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
      }}
    />
  );
};

const Walkthrough2 = () => {
  return (
    <Image
      style={{ height: 100, width: 100 }}
      source={{
        uri:
          'https://images.unsplash.com/photo-1547405358-4ef2671bb1bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
      }}
    />
  );
};
export default class WalkthroughScreen extends React.Component {
  render = () => (
    <View style={styles.screen}>
      <Walkthrough>
        <Walkthrough1 />
        <Walkthrough2 />
      </Walkthrough>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'yellow',
    paddingVertical: 28,
    alignItems: 'center',
    flex: 1,
  },
  button: {
    marginTop: 25,
    marginHorizontal: 16,
  },
});
