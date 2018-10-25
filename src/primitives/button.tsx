import React from 'react';
import { View, Platform, TouchableNativeFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './index';

export default ({ onPress, title, disabled, testID, ...props }: any) => {
  const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
  console.log(props);
  const { style, ...rest } = props;
  const { textAlign, color, ...rstyle } = StyleSheet.flatten(style);
  console.log(textAlign, color, rstyle);
  return (
    <Touchable {...rest} style={rstyle} testID={testID} disabled={disabled} onPress={onPress}>
      <View>
        <Text style={{ textAlign, color }}>{title}</Text>
      </View>
    </Touchable>
  );
};
