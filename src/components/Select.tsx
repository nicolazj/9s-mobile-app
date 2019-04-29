import React from 'react';
import { TouchableNativeFeedbackProps, TouchableOpacityProps, View } from 'react-native';

import * as P from '../primitives';
import styled, { scale, th } from '../styled';

const SelectTouchable = styled(P.Touchable)`
  border-bottom-color: #ccc;
  border-bottom-width: 1;
  width: 100%;
  height: ${scale(48)}px;
  padding: ${scale(15)}px;
  margin: 5px 0;
`;

const SelectText = styled(P.Text)`
  text-align: center;
  color: #111;
`;
interface Props {
  title: string;
}
const Select: React.FC<Props & TouchableNativeFeedbackProps & TouchableOpacityProps> = ({ title, ...props }) => (
  <SelectTouchable {...props}>
    <View>
      <SelectText> {title}</SelectText>
    </View>
  </SelectTouchable>
);
export default Select;
