import React from 'react';
import { StatusBar, Text, View } from 'react-native';

let i = 0;
export default () => {
  console.log('dashboard render', i++);

  return (
    <View>
      <StatusBar barStyle="light-content" />
      <Text>Home</Text>
    </View>
  );
};
