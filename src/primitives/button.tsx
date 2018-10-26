import React from 'react';
import { View, Platform, TouchableNativeFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './index';

export default ({ onPress, title, disabled, testID, children, ...props }: any) => {
  const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
  const { style, ...rest } = props;
  const { textAlign, color, ...rstyle } = StyleSheet.flatten(style);
  return (
    <Touchable {...rest} style={rstyle} testID={testID} disabled={disabled} onPress={onPress}>
      {children ? (
        children
      ) : (
        <View>
          <Text style={{ textAlign, color }}>{title}</Text>
        </View>
      )}
    </Touchable>
  );
};
